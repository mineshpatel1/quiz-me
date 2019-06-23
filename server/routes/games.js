const express = require('express');
const router = express.Router();

const games = require(__dirname + '/../models/games.js');
const notif = require(__dirname + '/../api/notif.js');
const utils = require(__dirname + '/../api/utils.js');

router.get('/game/test', (req, res, next) => {
  utils.response(res, 'Hello');
})

router.post('/game/request', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.settings) return next(new Error("Settings must be specified."));
  if (!data.opponent) return next(new Error("Opponent must be specified."));

  // Request a game, the requester is Player 1 by default
  games.request(
    req.session.user.id, data.opponent.id, data.settings,
  ).then(() => {
    utils.response(res);
  }).catch(next);
});

module.exports = router;