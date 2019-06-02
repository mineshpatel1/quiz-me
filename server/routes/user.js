const express = require('express');
const router = express.Router();

const users = require(__dirname + '/../models/users.js');
const utils = require(__dirname + '/../api/utils.js');
const email = require(__dirname + '/../api/email.js');
const session = require(__dirname + '/../api/session.js');

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
            .then(() => utils.response(res, {  unconfirmed: {email: newUser.email} }))
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
      session.sessionWithData(req)
        .then(payload => utils.response(res, payload))
        .catch(next);
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
        .then(() => utils.response(res, { unconfirmed: user.email }))
        .catch(next);
    })
    .catch(next);
});

router.post('/user/changePassword', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  if (!data.password) return next(new Error("Password is required."));

  users.changePassword(req.session.user.email, data.password)
    .then(() => utils.response(res))
    .catch(next);
});

router.post('/user/forgottenPassword', (req, res, next) => {
  let data = req.body;
  if (!data.email) return next(new Error("Email is required."));
  users.forgottenPassword(data.email)
    .then(([user, token, expiry_time]) => {
      req.session.resetPassword = { email: user.email, expiry_time: expiry_time };
      email.resetPassword(user, token)
        .then(() => utils.response(res, { resetPassword: user.email }))
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
      session.sessionWithData(req)
        .then(payload => utils.response(res, payload))
        .catch(next);
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
      return utils.response(res, { user });
    })
    .catch(next);
});

router.post('/user/disableFingerprint', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  users.disableFingerprint(req.session.user.id)
    .then(user => {
      req.session.user = user;
      return utils.response(res, { user });
    })
    .catch(next);
});

router.post('/user', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("Session is not active."));
  let fields = utils.update(req.session.user, data);
  users.update(fields)
    .then(user => {
      req.session.user = user;
      return utils.response(res, { user });
    })
    .catch(next);
});

router.delete('/user', (req, res, next) => {
  let email = req.session.user.email;
  if (!email) return next(new Error("User does not have an active session."));
  
  session.endSession(req)
    .then(() => {
      users.delete(email)
        .then(() => { return utils.response(res) })
        .catch(next)
    })
    .catch(next);
});

module.exports = router;