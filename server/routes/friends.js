const express = require('express');
const router = express.Router();

const users = require(__dirname + '/../models/users.js');
const friends = require(__dirname + '/../models/friends.js');
const utils = require(__dirname + '/../api/utils.js');

router.get('/friends', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  friends.get(req.session.user.id)
    .then(friends => { return utils.response(res, { friends }) })
    .catch(next);
});

router.post('/friends/request', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!req.data.email) return next(new Error("Friend's Email must be specified."));
  users.getFromEmail(req.data.email)
    .then(friend => { 
      friends.request(req.session.user.id, friend.id)
        .then(() => { return utils.response(res) })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
