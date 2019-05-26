const express = require('express');
const router = express.Router();

const users = require(__dirname + '/../models/users.js');
const friends = require(__dirname + '/../models/friends.js');
const utils = require(__dirname + '/../api/utils.js');

router.get('/friends', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  let _getFriends = friends.get(req.session.user.id);
  let _getRequests = friends.getRequests(req.session.user.id);

  Promise.all([_getFriends, _getRequests])
    .then(([_friends, _requests]) => { 
      return utils.response(res, { friends: _friends, requests: _requests });
    })
    .catch(next);
});

router.post('/friends/request', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.email) return next(new Error("Friend's Email must be specified."));
  if (req.session.user.email == data.email) return next(new Error("Can't be friends with yourself."));
  users.getFromEmail(data.email)
    .then(friend => {
      if (!friend) return next(new Error(data.email + " doesn't play QuizMe."))
      friends.request(req.session.user.id, friend.id)
        .then(() => { return utils.response(res) })
        .catch(next);
    })
    .catch(next);
});

router.post('/friends/confirm', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.friendId) return next(new Error("Friend's ID must be specified."));
  friends.confirm(req.session.user.id, data.friendId)
    .then(() => { return utils.response(res) })
    .catch(next)
});

router.post('/friends/unfriend', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.friendId) return next(new Error("Friend's ID must be specified."));
  friends.unfriend(req.session.user.id, data.friendId)
    .then(() => { return utils.response(res) })
    .catch(next)
});

module.exports = router;
