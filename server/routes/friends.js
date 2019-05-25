const express = require('express');
const router = express.Router();

const friends = require(__dirname + '/../models/friends.js');
const utils = require(__dirname + '/../api/utils.js');

router.get('/friends', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  friends.get(req.session.user.id)
    .then(friends => {
      return res.send({ ok: true, friends: friends });
    }).catch(next);
});

module.exports = router;
