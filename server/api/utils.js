const UIDGenerator = require('uid-generator');

/** Returns a short (10 Base36) UID token. */
exports.getToken = async () => {
  let uidgen = new UIDGenerator(UIDGenerator.BASE36, 10);
  return uidgen.generate();
}

/** Route handler for errors. */
exports.errorHandler = async (err, _req, res, _next) => {
  let _err;
  if (err instanceof Error) _err = err.message;
  else _err = err.toString();
  
  console.error(_err);
  return res.send({ error: _err });
}

/** Ends a session, deleting cookies. */
exports.endSession = async (req) => {
  return new Promise((resolve, reject) => {
    if (!req.session.user) return resolve();

    console.log('Logging out ' + req.session.user.email + '...');
    req.session.destroy(err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

/** Returns a URL to the server. */
exports.serverUrl = () => {
  let url = global.config.server.secure ? 'https' : 'http';
  url += '://' + global.config.server.host + ':' + global.config.server.port;
  return url;
}