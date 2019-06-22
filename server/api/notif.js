const fcm = require('firebase-admin');
const serviceAccount = require(__dirname + "/../../.config/fcm.json");

const utils = require(__dirname + '/../api/utils.js');

fcm.initializeApp({
  credential: fcm.credential.cert(serviceAccount),
  databaseURL: global.config.fcm.db_url,
});

exports.send = (title, body, data, tokens, ttl=300) => {
  let payload = {
    notification: {
      title: title,
      body: body,
    },
    data: data,
  };

  let options = {
    priority: "high",
    timeToLive: ttl,
  };

  utils.log("TEST NOTIF", title, data);
  utils.log(body);
  utils.log(data.random);

  fcm.messaging().sendToDevice(tokens, payload, options)
    .then(function(response) {
      utils.log("Successfully sent message:", response);
      console.log(response);
    })
    .catch(function(error) {
      utils.log("Error sending message:", error);
      console.log(error);
    });
}