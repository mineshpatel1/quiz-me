const pg = require('pg');

const timeout = 3000; // Timeout for connection to the server

// Creates a connection pool using the user specified database
exports.createPool = () => {
    var config = {
        user: global.config.pg.user,
        database: global.config.pg.db,
        password: global.config.pg.password,
        host: global.config.pg.host,
        port: global.config.pg.port, 
        max: 10, // Max number of clients in the pool
        idleTimeoutMillis: 1000, // How long a client is allowed to remain idle before being closed
    };
    return new pg.Pool(config);
}

exports.query = (query, pool=null, callback=null) => {
    if (!pool) pool = exports.createPool();
    pool.query(query, function (err, result) {
        if (err) {
            if (callback) callback(err);
        } else {
            if (callback) callback(false, result);
        }
    });
}
