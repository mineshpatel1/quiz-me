const pg = require(__dirname + '/../api/pg.js');

exports.User = class User{
  constructor(email, name=null) {
      if (!email) throw "User requires email address.";
      this.email = email;
      this.name = name;
  }
}

exports.get = (email) => {
  return new Promise((resolve, reject) => {
    pg.query(`SELECT * FROM users WHERE email = $1::text`, [email])
    .then(result => {
      if (result.length == 0) return resolve(null);
      if (result.length > 1) return reject("More than 1 user found for a single email.");
      return resolve(result[0]);
    })
    .catch(err => reject(err));
  });
}

exports.new = (user, password) => {
  return new Promise((resolve, reject) => {
    pg.query(
      `INSERT INTO users(email, name) VALUES ($1::text, $2::text);`, 
      [user.email, user.name],
    ).then(() => {
      pg.query(
        `INSERT INTO user_auth (id, password) VALUES (
          (SELECT id FROM users WHERE email = $1::text),
          crypt($2::text, gen_salt('bf'))
        );`, [user.email, password],
      )
      .then(resolve)
      .catch(err => reject(err));
    }).catch(err => { reject(err)});
  });
}