#!/usr/bin/env node

global.config = require(__dirname + '/../.config/config.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const utils = require(__dirname + '/api/utils.js');

// Certificate
var credentials;
try {
  credentials = {
    key: fs.readFileSync(global.config.server.cert_path + '/privkey.pem', 'utf8'),
    cert: fs.readFileSync(global.config.server.cert_path + '/cert.pem', 'utf8'),
    ca: fs.readFileSync(global.config.server.cert_path + '/chain.pem', 'utf8')
  };
  global.secure = true;
} catch {
  utils.warn('Did not find security certificates.');
  global.secure = false;
}

const app = express();
app.use(bodyParser.json());

app.use('/images', express.static(__dirname + '/assets/images/'));
app.use('/.well-known/acme-challenge/', express.static(__dirname + '/assets/cert/'));

app.use(require(__dirname + '/routes/general.js'));
app.use(require(__dirname + '/routes/session.js'));
app.use(require(__dirname + '/routes/user.js'));
app.use(require(__dirname + '/routes/friends.js'));

app.use(utils.errorHandler);

if (global.secure) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(global.config.server.port);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(global.config.server.port);
}

utils.log('Server started on ' + utils.serverUrl());
