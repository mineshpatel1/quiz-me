const express = require('express');
const session = require('express-session');
const router = express.Router();

const users = require(__dirname + '/../models/users.js');
const friends = require(__dirname + '/../models/friends.js');
const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');
const sessionApi = require(__dirname + '/../api/session.js');

// Configure sessionisation with PostgreSQL
router.use(session({
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

router.get('/session', (req, res, next) => {
  return utils.response(res, sessionApi.getSession(req));
});

router.get('/session/load', (req, res, next) => {
  sessionApi.sessionWithData(req)
    .then(payload => utils.response(res, payload))
    .catch(next);
});

router.post('/session/login', (req, res, next) => {
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
          sessionApi.sessionWithData(req, data.pushToken)
            .then(payload => utils.response(res, payload))
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

router.post('/session/login/fingerprint', (req, res, next) => {
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
          sessionApi.sessionWithData(req, data.pushToken)
            .then(payload => utils.response(res, payload))
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

router.get('/session/logout', (req, res, next) => {
  sessionApi.endSession(req)
    .then(() => utils.response(res))
    .catch(next);
});

module.exports = router;