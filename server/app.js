const express = require('express');
const session = require('express-session');

const pg = require(__dirname + '/api/pg.js');
global.config = require(__dirname + '/../keys/config.json');

const app = express();

// Configure sessionisation with PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.createPool(),
    tableName: 'sessions',
  }),
  secret: global.config.session_secret,
  resave: false,
  saveUninitialized: false,
  cookie : { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },  // 30 Days
  unset: 'destroy',
}));

app.get('/', function (req, res) {
  // if (!req.session.user) {
  //   req.session.user = Math.random();
  // }
  res.send('Hello World');
})

app.listen(global.config.server.port, function(){
  console.log('Node js Express js Tutorial');
});
