const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/../../.config/aws.json');

exports.send = (to, subject, body) => {
  console.log('Sending mail to ' + to + '...');
  let params = {
    Destination: { ToAddresses: [to] },
    ReturnPath: global.config.aws.smtp.email,
    Source: global.config.aws.smtp.email,
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        },
        Text: {
          Charset: "UTF-8",
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
  };
  let ses = new aws.SES();
  return ses.sendEmail(params).promise();
}
