const express = require('express');
const router = express.Router();

const users = require(__dirname + '/../models/users.js');

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

app.post('/session/login', (req, res, next) => {
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

app.post('/session/login/fingerprint', (req, res, next) => {
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