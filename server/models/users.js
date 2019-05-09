const pg = require(__dirname + '/../api/pg.js');

exports.User = class User{
  constructor(email, name=null) {
      if (!email) throw new Error("User requires email address.");
      this.email = email;
      this.name = name;
  }
}

exports.get = (email, confirmed=true) => {
  let query = `SELECT * FROM users WHERE email = $1::text`;
  if (confirmed) query += ' AND is_confirmed';
  return new Promise((resolve, reject) => {
    pg.query(query, [email])
    .then(result => {
      if (result.length == 0) return resolve(null);
      if (result.length > 1) return reject(new Error("More than 1 user found for a single email."));
      return resolve(result[0]);
    })
    .catch(reject);
  });
}

exports.delete = (email) => {
  console.log('Deleting user ' + email + '...');
  return new Promise((resolve, reject) => {
    pg.query(`DELETE FROM users WHERE email = $1::text`, [email])
    .then(resolve)
    .catch(reject);
  })
}

exports.auth = (email, password) => {
  return new Promise((resolve, reject) => {
    pg.query(
      `SELECT email FROM
        user_auth 
      WHERE
        email = $1::text
        AND password = crypt($2::text, password)`,
      [email, password],
    ).then(result => {
      if (result.length == 1) {
        console.log(email + ' logged in...');
        return resolve(true);
      }
      if (result.length == 0) return reject(new Error("Invalid password.")); 
      reject(new Error("Unexpected failure during password retrieval."));
    }).catch(reject);
  });
}

exports.new = (user, password) => {
  console.log('Creating new user ' + user.email + '...');
  return new Promise((resolve, reject) => {
    pg.query(
      `INSERT INTO users(email, name) VALUES ($1::text, $2::text)`, 
      [user.email, user.name],
    ).then(() => {
      pg.query(
        `INSERT INTO user_auth (email, password) VALUES (
          $1::text, crypt($2::text, gen_salt('bf'))
        )`, [user.email, password],
      )
      .then(() => {
        console.log('Successfully created user ' + user.email);
        resolve();
      })
      .catch(err => {
        console.error('Error creating user ' + user.email);
        reject(err);
      });
    }).catch(reject);
  });
}