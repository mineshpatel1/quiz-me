global.config = require(__dirname + '/../.config/config.json');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const utils = require(__dirname + '/api/utils.js');
const email = require(__dirname + '/api/email.js');
const pg = require(__dirname + '/api/pg.js');
const users = require(__dirname + '/models/users.js');

const app = express();
app.use(bodyParser.json());

// Configure sessionisation with PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pool,
    tableName: 'sessions',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },  // 30 Days
  unset: 'destroy',
}));

app.get('/', (_req, res, next) => {
  utils.getToken()
    .then(token => {
      res.send({test: token});
    })
    .catch(next);
});

app.get('/reset', (_req, res) => {
  res.redirect('quizme://quizme/reset')
});

app.get('/session', (req, res) => {
  res.send({ ok: true, user: req.session.user });
});

app.get('/session/logout', (req, res, next) => {
  utils.endSession(req)
    .then(() => res.send({ ok: true }))
    .catch(next);
});

app.get('/email', (_req, res) => {
  email.send('nesh.patel1@gmail.com', 'Test Email', 'This is some text')
    .then(data => {
      console.log('Success', data);
      return res.send("Email succeeded");
    }).catch(err => {
      console.log('Error', err);
      return res.send("Email failed");
    });
});

app.post('/user/new', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Email is required."));

  let newUser = new users.User(data.email, data.name);
  users.get(data.email, false)
    .then(user => {
      if (user) {
        if (!user.is_confirmed) return next(new Error("Unconfirmed user with this email already exists."));
        return next(new Error("User with this email already exists."));
      };
      users.new(newUser, data.password)
        .then(() => {
          req.session.user = newUser;
          return res.send({ ok: true, user: newUser });
        })
        .catch(next);
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

  users.get(data.email)
    .then(user => {
      if (!user) return next(new Error("No user with email " + data.email + " exists."));
      users.auth(data.email, data.password)
        .then(() => {
          req.session.user = user;  // Activate session
          return res.send({ ok: true, user: user });
        })
        .catch(next)
    })
    .catch(next)
});

app.use(utils.errorHandler);

app.listen(global.config.server.port, () => {
  console.log('QuizMe Server Started');
});
