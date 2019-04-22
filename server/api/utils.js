const constants = require(__dirname + '/../constants.json');
const errors = constants.errors;

exports.sendError = (res, code) => {
  return res.status(code).send(errors[code.toString()]);
}