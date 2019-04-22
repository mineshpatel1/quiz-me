const pg = require('pg');
const config = {
  user: global.config.pg.user,
  database: global.config.pg.db,
  password: global.config.pg.password,
  host: global.config.pg.host,
  port: global.config.pg.port, 
  max: 10, // Max number of clients in the pool
  idleTimeoutMillis: 1000, // How long a client is allowed to remain idle before being closed
};

// Creates a connection pool using the user specified database
exports.createPool = () => {
  return new pg.Pool(config);
}

exports.pool = exports.createPool();

exports.query = (sql, params=null) => {
  return new Promise((resolve, reject) => {
    exports.pool.connect()
    .then(client => {
      client.query(sql, params)
        .then(result => {
          client.release();
          return resolve(result.rows);
        })
        .catch(err => {
          client.release();
          return reject(err);
        })
    });
  });
}
