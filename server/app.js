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

app.use('/images', express.static(__dirname + '/assets/images/'))

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
  if (req.unconfirmed && req.unconfirmed.expiry_time < (Date.now())) {
    req.session.unconfirmed = undefined;
  }
  return res.send({ ok: true, user: req.session.user });
});

app.get('/session/logout', (req, res, next) => {
  utils.endSession(req)
    .then(() => res.send({ ok: true }))
    .catch(next);
});

app.get('/activate/:token', (req, res, next) => {
  console.log(req.params.token);
  res.send({ ok: true });
});

app.get('/email', (_req, res, next) => {
  email.send(
    'nesh@lightyearfoundation.org', 'Activate QuizMe account', 'activate', 
    { user: 'Chinnu', token: '12345678'}
  ).then(data => {
      console.log('Success', data);
      return res.send("Email succeeded");
    }).catch(next);
});

app.get('/user/register', (req, res, next) => {
  // let data = req.body;
  let data = {
    email: 'nesh@lightyearfoundation.org',
    password: 'D1sney34',
  }
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Password is required."));

  let newUser = new users.User(data.email, data.name);
  users.get(data.email, false)
    .then(user => {
      if (user) {
        if (!user.is_activated) return next(new Error("Unconfirmed user with this email already exists."));
        return next(new Error("User with this email already exists."));
      }
      
      users.new(newUser, data.password)
        .then((token, expiry_time) => {
          console.log('After');
          console.log(token);

          req.session.unconfirmed = { email: newUser.email, expiry_time: expiry_time };
          let name = newUser.name ? newUser.name : newUser.email;
          console.log('About to send email');
          email.send(
            newUser.email, 'Activate QuizMe account', 'activate',
            { user: name, token: token }
          ).then(data => {
            console.log('Send confiormation mail to ' + newUser.email);
            return res.send({ ok: true, user: newUser });
          }).catch(next);
        })
    })
    .catch(next);
});

app.post('/user/new', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  if (!data.password) return next(new Error("Password is required."));

  let newUser = new users.User(data.email, data.name);
  users.get(data.email, false)
    .then(user => {
      if (user) {
        if (!user.is_activated) return next(new Error("Unconfirmed user with this email already exists."));
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
