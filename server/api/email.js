const fs = require('fs');
const ejs = require('ejs');
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../../.config/aws.json');

const utils = require(__dirname + '/../api/utils.js');
const templatePath = __dirname + '/../assets/emails';

loadTemplate = (template, params={}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      templatePath + '/' + template + '.html', 'utf-8', 
      (err, content) => {
        if (err) return reject(err);
        return resolve(ejs.render(content, params));
      }
    );
  });
}

exports.send = async (to, subject, template, params) => {
  utils.log('Sending mail to ' + to + '...');

  return new Promise((resolve, reject) => {
    loadTemplate(template, params)
    .then(body => {
      let mailParams = {
        Destination: { ToAddresses: [to] },
        ReturnPath: global.config.aws.email,
        Source: global.config.aws.email,
        Message: {
          Body: { Html: { Charset: 'UTF-8', Data: body } },
          Subject: { Charset: 'UTF-8', Data: subject }
        },
      };
      let ses = new aws.SES();
      ses.sendEmail(mailParams).promise()
        .then(resolve)
        .catch(reject);
    })
    .catch(reject);
  });
}

exports.activate = async (user, token) => {
  let name = user.name ? user.name : user.email;
  return exports.send(
    user.email, 'Activate QuizMe account', 'activate',
    { user: name, token: token, url: utils.serverUrl() + '/appRedirect/activate/' }
  ).then(() => utils.log('Sent activation mail to ' + user.email));
}

exports.resetPassword = async (user, token) => {
  let name = user.name ? user.name : user.email;
  return exports.send(
    user.email, 'QuizMe: Forgotten Password', 'resetPassword',
    { user: name, token: token, url: utils.serverUrl() + '/appRedirect/resetPassword/' }
  ).then(() => utils.log('Sent reset password mail to ' + user.email));
}