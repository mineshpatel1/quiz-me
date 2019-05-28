const utils = require(__dirname + '/utils.js');
const users = require(__dirname + '/../models/users.js');
const friends = require(__dirname + '/../models/friends.js');

exports.getSession = req => {
  if (req.unconfirmed && req.unconfirmed.expiry_time < utils.now()) {
    req.session.unconfirmed = undefined;
  }

  if (req.resetPassword && req.resetPassword.expiry_time < utils.now()) {
    req.session.resetPassword  = undefined;
  }

  return {
    user: req.session.user,
    unconfirmed: req.session.unconfirmed,
    resetPassword: req.session.resetPassword,
    friends: req.session.friends,
    requests: req.session.requests,
  };
}

exports.sessionWithData = req => {
  return new Promise((resolve, reject) => {
    let payload = exports.getSession(req);
    if (req.session.user) {
      let id = req.session.user.id;
      Promise.all([
        users.get(id),
        friends.get(id),
        friends.getRequests(id),
      ]).then(([_user, _friends, _requests]) => {
        req.session.user = _user;
        payload.user = _user;
        payload.friends = _friends;
        payload.requests = _requests;
        return resolve(payload);
      })
      .catch(reject);
    } else {
      return resolve(payload);
    }
  });
}

/** Ends a session, deleting cookies. */
exports.endSession = req => {
  return new Promise((resolve, reject) => {
    if (!req.session.user) return resolve();

    utils.log('Logging out ' + req.session.user.email + '...');
    req.session.destroy(err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}