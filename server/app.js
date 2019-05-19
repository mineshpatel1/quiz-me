#!/usr/bin/env node

global.config = require(__dirname + '/../.config/config.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Certificate
var credentials;
try {
  credentials = {
    key: fs.readFileSync(global.config.server.certPath + '/privkey.pem', 'utf8'),
    cert: fs.readFileSync(global.config.server.certPath + '/cert.pem', 'utf8'),
    ca: fs.readFileSync(global.config.server.certPath + '/chain.pem', 'utf8')
  };
  global.secure = true;
} catch {
  console.warn('Did not find security certificates.');
  global.secure = false;
}

const utils = require(__dirname + '/api/utils.js');
const email = require(__dirname + '/api/email.js');
const pg = require(__dirname + '/api/pg.js');
const users = require(__dirname + '/models/users.js');
const cron = require(__dirname + '/api/cron.js');

const app = express();
app.use(bodyParser.json());

app.use('/images', express.static(__dirname + '/assets/images/'));
app.use('/.well-known/acme-challenge/', express.static(__dirname + '/assets/cert/'));

// Configure sessionisation with PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pool,
    tableName: 'sessions',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: 28 * 24 * 60 * 60 * 1000 },  // 28 Days
  unset: 'destroy',
}));

app.get('/', (_req, res, next) => {
  res.send(utils.serverUrl())
});

app.get('/session', (req, res) => {
  if (req.unconfirmed && req.unconfirmed.expiry_time < utils.now()) {
    req.session.unconfirmed = undefined;
  }

  if (req.resetPassword && req.resetPassword.expiry_time < utils.now()) {
    req.session.resetPassword  = undefined;
  }

  return res.send({
    ok: true,
    user: req.session.user,
    unconfirmed: req.session.unconfirmed,
    resetPassword: req.session.resetPassword,
  });
});

app.get('/session/logout', (req, res, next) => {
  utils.endSession(req)
    .then(() => res.send({ ok: true }))
    .catch(next);
});

app.get('/appRedirect/:path/:token', (req, res, _next) => {
  res.redirect('quizme://quizme/' + req.params.path + '/' + req.params.token);
});

app.post('/user/register', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Password is required."));

  let newUser = { email: data.email, name: data.name };
  users.getFromEmail(data.email, false)
    .then(user => {
      if (user) {
        if (!user.is_activated) return next(new Error("Unconfirmed user with this email already exists."));
        return next(new Error("User with this email already exists."));
      }
      
      users.new(newUser, data.password)
        .then(([token, expiry_time]) => {
          req.session.unconfirmed = { email: newUser.email, expiry_time: expiry_time };
          email.activate(newUser, token)
            .then(() => res.send({ ok: true, unconfirmed: newUser.email }))
            .catch(next);
        })
    })
    .catch(next);
});

app.post('/user/resetToken', (req, res, next) => {
  let data = req.body;
  if (!req.session.unconfirmed) return next(new Error("Session is not in an unconfirmed state."));
  if (!data.email) return next(new Error("Email is required."));
  users.resetActivationToken(data.email)
    .then(([user, token, expiry_time]) => {
      req.session.unconfirmed = { email: user.email, expiry_time: expiry_time };
      email.activate(user, token)
        .then(() => res.send({ ok: true, unconfirmed: user.email }))
        .catch(next);
    })
    .catch(next);
});

app.post('/user/activate', (req, res, next) => {
  let data = req.body;
  if (!req.session.unconfirmed) return next(new Error("Session is not in an unconfirmed state."));
  if (!data.email) return next(new Error("Email is required."));
  if (!data.token) return next(new Error("Token is required."));

  users.activate(data.email, data.token)
    .then(user => {
      req.session.unconfirmed = null;
      req.session.user = user;
      res.send({ ok: true, user: user });
    })
    .catch(next);
});

app.post('/user/changePassword', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  if (!data.password) return next(new Error("Password is required."));

  users.changePassword(req.session.user.email, data.password)
    .then(() => res.send({ ok: true }))
    .catch(next);
});

app.post('/user/forgottenPassword', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  users.forgottenPassword(data.email)
    .then(([user, token, expiry_time]) => {
      req.session.resetPassword = { email: user.email, expiry_time: expiry_time };
      email.resetPassword(user, token)
        .then(() => res.send({ ok: true, resetPassword: user.email }))
        .catch(next);
    })
    .catch(next);
});

app.post('/user/enableFingerprint', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  if (!data.publicKey) return next(new Error("Public Key is required."));
  users.enableFingerprint(req.session.user.id, data.publicKey)
    .then(user => {
      req.session.user = user;
      return res.send({ ok: true, user: user });
    })
    .catch(next);
});

app.post('/user/disableFingerprint', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  users.disableFingerprint(req.session.user.id)
    .then(user => {
      req.session.user = user;
      return res.send({ ok: true, user: user });
    })
    .catch(next);
});

app.post('/user/resetPassword', (req, res, next) => {
  let data = req.body;
  if (!req.session.resetPassword) return next(new Error("Session is not in an password reset state."));
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Password is required."));
  if (!data.token) return next(new Error("Token is required."));

  users.resetPassword(data.email, data.token, data.password)
    .then(user => {
      req.session.resetPassword = null;
      req.session.user = user;
      res.send({ ok: true, user: user });
    })
    .catch(next);
});

app.delete('/user', (req, res, next) => {
  let email = req.session.user.email;
  if (!email) return next(new Error("User does not have an active session."));
  
  utils.endSession(req)
    .then(() => {
      users.delete(email)
        .then(() => { return res.send({ ok: true }) })
        .catch(next)
    })
    .catch(next);
});

app.post('/user/auth', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Password is required."));
  if (req.session.user) return next(new Error("User is already logged in."));

  users.getFromEmail(data.email)
    .then(user => {
      if (!user) return next(new Error("No user with email " + data.email + " exists."));
      users.auth(data.email, data.password)
        .then(() => {
          req.session.user = user;  // Activate session
          return res.send({ ok: true, user: user });
        })
        .catch(next);
    })
    .catch(next);
});

app.post('/user/auth/fingerprint', (req, res, next) => {
  let data = req.body;
  if (!data.payload) return next(new Error("Payload is required;"));
  if (!data.signature) return next(new Error("Signature is required;"));
  if (req.session.user) return next(new Error("User is already logged in."));

  users.get(data.payload.id)
    .then(user => {
      if (!user) return next(new Error("No user with ID " + data.payload.id + " exists."));
      users.verifyFingerprint(data.payload.id, data.signature, JSON.stringify(data.payload))
        .then(() => {
          req.session.user = user;  // Activate session
          return res.send({ ok: true, user: user });
        })
        .catch(next);
    })
    .catch(next);
});

app.use(utils.errorHandler);

if (global.secure) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(global.config.server.port);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(global.config.server.port);
}

console.log('Listening on ' + utils.serverUrl());
