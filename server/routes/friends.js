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

router.get('/friends/requestCount', (req, res, next) => {
  if (!req.session.user) return next(new Error("User is not logged in."));
  friends.getRequests(req.session.user.id)
    .then(requests => {
      return utils.response(res, { requestCount: requests.length });
    })
    .catch(next)
});

router.post('/friends/requests', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.emails) return next(new Error("Friend's Emails must be specified."));
  let emails = utils.removeFromArray(data.emails, req.session.user.email);
  if (emails.length == 0) return next(new Error("None of the requested people play QuizMe."));

  friends.getPotentialFriends(req.session.user.id, emails)
    .then(_friends => {
      if (_friends.length == 0) return next(new Error("None of the requested people play QuizMe."));
      let idPairs = _friends.map(friend => [req.session.user.id, friend.id]);
      console.log(idPairs);
      friends.request(idPairs)
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

router.post('/friends/possible', (req, res, next) => {
  let data = req.body;
  if (!req.session.user) return next(new Error("User is not logged in."));
  if (!data.emails) return next(new Error("Friend's emails must be specified."));
  let emails = utils.removeFromArray(data.emails, req.session.user.email);
  friends.getPotentialFriends(req.session.user.id, emails)
    .then(_users => { return utils.response(res, { users: _users }) })
    .catch(next)
});

module.exports = router;
