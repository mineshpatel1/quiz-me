#!/usr/bin/env node

global.config = require(__dirname + '/../.config/config.json');

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Certificate
var credentials;
try {
  credentials = {
    key: fs.readFileSync(global.config.server.certPath + '/privkey.pem', 'utf8'),
    cert: fs.readFileSync(global.config.server.certPath + '/cert.pem', 'utf8'),
    ca: fs.readFileSync(global.config.server.certPath + '/chain.pem', 'utf8')
  };
  global.secure = true;
} catch {
  console.warn('Did not find security certificates.');
  global.secure = false;
}

const utils = require(__dirname + '/api/utils.js');
const email = require(__dirname + '/api/email.js');
const pg = require(__dirname + '/api/pg.js');
const users = require(__dirname + '/models/users.js');

const app = express();
app.use(bodyParser.json());

app.use('/images', express.static(__dirname + '/assets/images/'));
app.use('/.well-known/acme-challenge/', express.static(__dirname + '/assets/cert/'));

// Configure sessionisation with PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pool,
    tableName: 'sessions',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: 28 * 24 * 60 * 60 * 1000 },  // 28 Days
  unset: 'destroy',
}));

app.use(require(__dirname + '/routes/general.js'));
app.use(require(__dirname + '/routes/session.js'));
app.use(require(__dirname + '/routes/user.js'));

app.use(utils.errorHandler);

if (global.secure) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(global.config.server.port);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(global.config.server.port);
}

console.log('Listening on ' + utils.serverUrl());
