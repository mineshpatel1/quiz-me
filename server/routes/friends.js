const express = require('express');
const router = express.Router();

const friends = require(__dirname + '/../models/friends.js');
const utils = require(__dirname + '/../api/utils.js');

router.get('/friends', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  friends.get(req.session.user.id)
    .then(friends => { return utils.response({ friends }) })
    .catch(next);
});

router.post('/friends/request', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!req.data.friendId) return next(new Error("Friend ID must be specified."));

  friends.request(req.session.user.id, req.data.friendId)
    .then(() => { return utils.response() })
    .catch(next);
});

module.exports = router;
