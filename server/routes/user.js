const express = require('express');
const router = express.Router();

const email = require(__dirname + '/../api/email.js');
const users = require(__dirname + '/../models/users.js');
const utils = require(__dirname + '/../api/utils.js');

router.use(require(__dirname + '/../routes/session.js'));

router.post('/user/register', (req, res, next) => {
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

router.post('/user/activate', (req, res, next) => {
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

router.post('/user/resetToken', (req, res, next) => {
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

router.post('/user/changePassword', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  if (!data.password) return next(new Error("Password is required."));

  users.changePassword(req.session.user.email, data.password)
    .then(() => res.send({ ok: true }))
    .catch(next);
});

router.post('/user/forgottenPassword', (req, res, next) => {
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

router.post('/user/resetPassword', (req, res, next) => {
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

router.post('/user/enableFingerprint', (req, res, next) => {
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

router.post('/user/disableFingerprint', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  users.disableFingerprint(req.session.user.id)
    .then(user => {
      req.session.user = user;
      return res.send({ ok: true, user: user });
    })
    .catch(next);
});

router.delete('/user', (req, res, next) => {
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

module.exports = router;