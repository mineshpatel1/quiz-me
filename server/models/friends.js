const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');

const users = require(__dirname + '/users.js');

exports.get = id => {
  return new Promise((resolve, reject) => {
    pg.query(`
    SELECT
      u.id,
      u.email,
      u.name
    FROM
      user_friends uf
      INNER JOIN users u ON 
        u.id = uf.user_id AND
        u.is_activated
    WHERE
      uf.user_id = $1::integer
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