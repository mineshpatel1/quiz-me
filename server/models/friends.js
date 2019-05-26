const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');

const users = require(__dirname + '/users.js');

exports.get = id => {
  return new Promise((resolve, reject) => {
    pg.query(`
    SELECT
      u.id, u.email, u.name
    FROM
      user_friends uf
      INNER JOIN users u ON 
        u.id = uf.friend_id AND
        u.is_activated
    WHERE
      uf.user_id = $1::integer
      AND uf.is_confirmed
    `, [id])
      .then(result => {
        let friends = [];
        result.forEach(row => {
          friends.push(new User(row));
        });
        return resolve(friends);
      })
      .catch(reject);
  });
}

/** Gets incoming requests for a given user, that they can confirm or reject. */
exports.getRequests = id => {
  return new Promise((resolve, reject) => {
    pg.query(`
      SELECT
        u.id, u.email, u.name
      FROM
        user_friends uf
        INNER JOIN users u ON 
          u.id = uf.user_id AND
          u.is_activated
      WHERE
        uf.friend_id = $1::integer
        AND NOT uf.is_confirmed
    `, [id])
      .then(result => {
        let requests = [];
        result.forEach(row => {
          requests.push(new User(row));
        });
        return resolve(requests);
      })
      .catch(reject);
  });
}

exports.request = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    pg.query(`
      INSERT INTO user_friends (user_id, friend_id, is_confirmed)
      VALUES ($1::integer, $2::integer, FALSE)
    `, [userId, friendId])
      .then(() => {
        utils.log("Friend request made from " + userId.toString() + " to " + friendId.toString());
        return utils.response(res);
      })
      .catch(reject)
    });
}