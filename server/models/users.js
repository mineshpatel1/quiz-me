const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');

exports.User = class User{
  constructor(email, name=null) {
      if (!email) throw new Error("User requires email address.");
      this.email = email;
      this.name = name;
  }
}

exports.get = (email, activated=true) => {
  let query = `SELECT * FROM users WHERE email = $1::text`;
  if (activated) query += ' AND is_activated';
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
      `INSERT INTO users(email, name, created_time) 
      VALUES ($1::text, $2::text, EXTRACT(epoch FROM now()))`, 
      [user.email, user.name],
    ).then(() => {
      console.log('Inserted User');
      pg.query(
        `INSERT INTO user_auth (email, password) 
        VALUES ($1::text, crypt($2::text, gen_salt('bf')))`,
        [user.email, password],
      ).then(() => {
        console.log('Inserted Auth');
          utils.getToken()
          .then(token => {
            console.log('Got token', token);
            // Insert token with a 48 hour expiry time
            let expiry_time = Math.ceil(Date.now() / 1000) + (60 * 60 * 48);
            pg.query(
              `INSERT INTO confirm_tokens (token, email, expiry_time) 
              VALUES ($1::text, $2::text, $3::bigint)`,
              [token, user.email, expiry_time],
            ).then(() => {
              console.log('Successfully created user: ' + user.email);
              console.log('Completed', token, expiry_time);
              return resolve(token, expiry_time);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
  });
}