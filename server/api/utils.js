exports.errorHandler = (err, _req, res, _next) => {
  let _err;
  if (err instanceof Error) _err = err.message;
  else _err = err.toString();
  
  console.error(_err);
  return res.send({ error: _err });
}

exports.error = (res, err) => {
  let _err;
  if (err instanceof Error) _err = err.message 
  else _err = err.toString();
  
  console.error(_err);
  return res.send({ error: _err });
}

exports.endSession = (req) => {
  return new Promise((resolve, reject) => {
    if (!req.session.user) return resolve();

    console.log('Logging out ' + req.session.user.email + '...');
    req.session.destroy(err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}