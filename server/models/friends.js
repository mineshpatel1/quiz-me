const format = require('pg-format');

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
          friends.push(new users.User(row));
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
        new users.User({ id: 3 });
        result.forEach(row => {
          requests.push(new users.User(row));
        });
        return resolve(requests);
      })
      .catch(reject);
  });
}

exports.getPotentialFriends = (userId, emails) => {
  return new Promise((resolve, reject) => {
    pg.query(`
    SELECT
      u.id, u.email, u.name,
      uf.user_id
    FROM
      users u
      LEFT JOIN user_friends uf ON
        u.id = uf.friend_id
        AND uf.user_id = $1::integer
    WHERE
      u.email = ANY($2::text[])
      AND u.is_activated 
      AND uf.friend_id IS NULL
    `, [userId, emails])
      .then(result => {
        let _users = result.map(u => new users.User(u));
        return resolve(_users);
      })
      .catch(reject);
  });
}

exports.request = (idPairs) => {
  return new Promise((resolve, reject) => {
    let values = idPairs.map(val => [val[0], val[1], false]);
    pg.query(format(`
      INSERT INTO user_friends (user_id, friend_id, is_confirmed) VALUES %L
    `, values))
      .then(() => {
        utils.log(idPairs.length + " friend request made from " + idPairs[0][0].toString());
        return resolve();
      })
      .catch(reject)
    });
}

exports.confirm = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    let q1 = pg.query(`
      UPDATE user_friends SET is_confirmed = TRUE 
      WHERE user_id = $1::integer AND friend_id = $2::integer
    `, [friendId, userId]);
    
    // Create reverse association
    let q2 = pg.query(`
      INSERT INTO user_friends (user_id, friend_id, is_confirmed)
      VALUES ($1::integer, $2::integer, TRUE)
      ON CONFLICT ON CONSTRAINT user_friends_assoc_key DO
        UPDATE SET is_confirmed = TRUE
    `, [userId, friendId]);

    Promise.all([q1, q2]).then(resolve).catch(reject);
  })
}

exports.unfriend = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    pg.query(`
      DELETE FROM user_friends
      WHERE (
        (user_id = $1::integer AND friend_id = $2::integer) OR
        (user_id = $2::integer AND friend_id = $1::integer)
      )
    `, [friendId, userId])
      .then(resolve).catch(reject);
  });
}