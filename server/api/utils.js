const UIDGenerator = require('uid-generator');
const colours = require('colors/safe');

/** Formats a Date as YYYY-MM-DD */
exports.formatDate = date => {
  let dt = new Date(date);
  let month = (dt.getMonth() + 1).toString().padStart(2, '0');
  let day = dt.getDate().toString().padStart(2, '0');
  let year = dt.getFullYear();
  return [year, month, day].join('-');
}

exports.formatTime = time => {
  let t = new Date(time);
  let h = (t.getHours().toString().padStart(2, '0'));
  let m = (t.getMinutes().toString().padStart(2, '0'));
  let s = (t.getSeconds().toString().padStart(2, '0'));
  return [h, m, s].join(':');
}

/** Updates an old object with a new one, returning a completely new Object. */
exports.update = (prev, next) => {
  return Object.assign({}, prev, next);
}

/** Removes a specific element from array by value. */
exports.removeFromArray = (_array, val) => {
  if (_array.indexOf(val) == -1) return _array;
  _array.splice(_array.indexOf(val), 1);
  return _array;
}

/** Formats log message */
exports.formatLog = (msg, level) => {
  let dt = new Date();
  let dtStr = exports.formatDate(dt);
  dtStr += ' ' + exports.formatTime(dt);

  let _level = level.toUpperCase().padEnd(5);
  let _method = 'log';
  switch (level) {
    case 'debug':
      _level = colours.grey(_level);
      _method = 'debug';
    case 'info':
      _level = colours.white(_level);
      break;
    case 'warn':
      _level = colours.yellow(_level);
      _method = 'warn';
      break;
    case 'error':
      _level = colours.red(_level);
      _method = 'error';
      break;
  }
  console[_method]('[' + _level + '][' + dtStr + '] ' + msg);
}

/** Returns the current time in UTC seconds. */
exports.now = () => {
  return Math.ceil(Date.now() / 1000);
}

exports.log = msg => exports.formatLog(msg, 'info');

exports.warn = msg => exports.formatLog(msg, 'warn');

exports.error = msg => exports.formatLog(msg, 'error');

/** Returns a short (10 Base36) UID token. */
exports.getToken = async () => {
  let uidgen = new UIDGenerator(UIDGenerator.BASE36, 10);
  return uidgen.generate();
}

/** Standard handle for successful responses. */
exports.response = (res, payload) => {
  payload = payload || {};
  payload.ok = true;
  res.send(payload);
}

/** Route handler for errors. */
exports.errorHandler = (err, _req, res, _next) => {
  let _err;
  if (err instanceof Error) _err = err.message;
  else _err = err.toString();
  
  exports.error(_err);
  return res.send({ error: _err });
}

/** Ends a session, deleting cookies. */
exports.endSession = async (req) => {
  return new Promise((resolve, reject) => {
    if (!req.session.user) return resolve();

    exports.log('Logging out ' + req.session.user.email + '...');
    req.session.destroy(err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

/** Returns a URL to the server. */
exports.serverUrl = () => {
  let url = global.secure ? 'https' : 'http';
  url += '://' + global.config.server.host;
  url += ':' + global.config.server.port;
  return url;
}