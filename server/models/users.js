const pg = require(__dirname + '/../api/pg.js');
const utils = require(__dirname + '/../api/utils.js');

const ACTIVATION_TOKEN_LIFE = (60 * 60 * 48);  // 48 Hours
const PASSWORD_TOKEN_LIFE = (60 * 60); // 1 Hour

class User {
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.name = row.name;
    this.is_activated = row.is_activated;
    this.fingerprint_enabled = row.fingerprint_key ? true: false;
  }
}

exports.get = id => {
  return new Promise((resolve, reject) => {
    pg.query(`SELECT * FROM users WHERE id = $1::integer AND is_activated`, [id])
      .then(result => {
        if (result.length == 0) return resolve(null);
        if (result.length > 1) return reject(new Error("More than 1 user found for a single ID."));
        return resolve(new User(result[0]));
      })
      .catch(reject);
  });
}

exports.getFromEmail = (email, activated=true) => {
  let query = `SELECT * FROM users WHERE email = $1::text`;
  if (activated) query += ' AND is_activated';
  return new Promise((resolve, reject) => {
    pg.query(query, [email])
      .then(result => {
        if (result.length == 0) return resolve(null);
        if (result.length > 1) return reject(new Error("More than 1 user found for a single email."));
        return resolve(new User(result[0]));
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

exports.resetActivationToken = email => {
  return new Promise((resolve, reject) => {
    exports.getFromEmail(email, false)
      .then(user => {
        if (!user) return reject(new Error("No user found with email: " + email));
        utils.getToken()
          .then(token => {
            let expiry_time = utils.now() + ACTIVATION_TOKEN_LIFE;
            pg.query(
              `UPDATE confirm_tokens SET
                token = $1::text,
                expiry_time = $2::bigint
              WHERE email = $3::text;`,
              [token, expiry_time, email],
            ).then(() => {
              console.log('Reset activation token for ' + email + '.');
              return resolve([user, token, expiry_time]);
            }).catch(reject);
          })
          .catch(reject);
      })
    .catch(reject);
  });
}

exports.forgottenPassword = email => {
  return new Promise((resolve, reject) => {
    exports.getFromEmail(email)
      .then(user => {
        if (!user) return reject(new Error("No user found with email: " + email));
        utils.getToken()
          .then(token => {
            let expiry_time = utils.now() + PASSWORD_TOKEN_LIFE;
            pg.query(
              `INSERT INTO forgotten_password_tokens (email, token, expiry_time)
              VALUES ($1::text, $2::text, $3::bigint) 
              ON CONFLICT (email) DO
              UPDATE SET
                token = $2::text,
                expiry_time = $3::bigint`,
              [user.email, token, expiry_time],
            ).then(() => {
              console.log('Sent password reset link to ' + email + '.');
              return resolve([user, token, expiry_time]);
            }).catch(reject);
          }).catch(reject);
      }).catch(reject);
  });
}

exports.changePassword = (email, password) => {
  return pg.query(
    `UPDATE user_auth SET password = crypt($1::text, gen_salt('bf'))
    WHERE email = $2::text`,
    [password, email]
  );
}

exports.resetPassword = (email, token, password) => {
  return new Promise((resolve, reject) => {
    exports.getFromEmail(email)
      .then(user => {
        if (!user) return reject(new Error("No user found with email: " + email));
        pg.query(
          `SELECT token FROM forgotten_password_tokens 
          WHERE email = $1::text AND token = $2::text AND expiry_time > now_utc()`,
          [email, token]
        ).then(result => {
          if (result.length == 0) return reject(new Error("Invalid reset token."));
          exports.changePassword(email, password).then(() => {
            pg.query(
              `DELETE FROM forgotten_password_tokens WHERE email = $1::text`, [user.email]
            ).then(() => {
              console.log('Password reset for ' + email + '.');
              resolve(user);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
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
      pg.query(
        `INSERT INTO user_auth (email, password) 
        VALUES ($1::text, crypt($2::text, gen_salt('bf')))`,
        [user.email, password],
      ).then(() => {
          utils.getToken()
            .then(token => {
              // Insert token with a 48 hour expiry time
              let expiry_time = utils.now() + ACTIVATION_TOKEN_LIFE;
              pg.query(
                `INSERT INTO confirm_tokens (token, email, expiry_time) 
                VALUES ($1::text, $2::text, $3::bigint)`,
                [token, user.email, expiry_time],
              ).then(() => {
                console.log('Successfully created user: ' + user.email);
                return resolve([token, expiry_time]);
              }).catch(reject);
            }).catch(reject);
        }).catch(reject);
      }).catch(reject);
  });
}

exports.activate = (email, token) => {
  console.log('Activating user ' + email + '...');
  return new Promise((resolve, reject) => {
    exports.getFromEmail(email, false)
      .then(user => {
        if (!user) return reject(new Error("No user found with email: " + email));
        if (user.is_activated) return reject(new Error("User already activated."));
        
        pg.query(
          `SELECT expiry_time FROM confirm_tokens
           WHERE email = $1::text AND token = $2::text AND expiry_time > now_utc()`,
          [user.email, token]
        ).then(result => {
          if (result.length == 0) return reject(new Error("Invalid activation token."));
          pg.query(
            `UPDATE users SET is_activated = TRUE WHERE id = $1::integer`,
            [user.id],
          ).then(() => {
            pg.query(
              `DELETE FROM confirm_tokens WHERE email = $1::text`, [user.email]
            ).then(() => {
              console.log('Activated user ' + user.email + '.');
              user.is_activated = true;
              return resolve(user);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      }).catch(reject);
  });
}

exports.enableFingerprint = (id, publicKey) => {
  return new Promise((resolve, reject) => {
    exports.get(id)
      .then(user => {
        pg.query(
          `UPDATE users SET fingerprint_key = $1::text WHERE id = $2::integer`,
          [publicKey, user.id]
        ).then(() => {
          user.fingerprint_enabled = true;
          console.log('Enabled fingerprint for user ' + id + '.');
          return resolve(user);
        }).catch(reject);
      }).catch(reject);
  })
}

exports.disableFingerprint = (id) => {
  return new Promise((resolve, reject) => {
    exports.get(id)
      .then(user => {
        pg.query(
          `UPDATE users SET fingerprint_key = NULL WHERE id = $1::integer`,
          [user.id]
        ).then(() => {
          user.fingerprint_enabled = false;
          console.log('Disabled fingerprint for user ' + id + '.');
          return resolve(user);
        }).catch(reject);
      }).catch(reject);
  })
}