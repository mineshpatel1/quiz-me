const pg = require(__dirname + '/../api/pg.js');

exports.get = (email) => {
  return new Promise((resolve, reject) => {
    pg.query(`SELECT * FROM users WHERE email = $1::text`, [email])
    .then(result => {
      if (result.length == 0) return resolve(null);
      if (result.length > 1) return reject("More than 1 user found for a single email.");
      return resolve(result[0]);
    })
    .catch(err => {
      return reject(err);
    })
  });
  
}