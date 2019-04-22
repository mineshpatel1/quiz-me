const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

global.config = require(__dirname + '/../.config/config.json');
const utils = require(__dirname + '/api/utils.js');
const pg = require(__dirname + '/api/pg.js');
const users = require(__dirname + '/models/users.js');

const app = express();
app.use(bodyParser.json());

// Configure sessionisation with PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pg.pool,
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
});

app.get('/user', function(req, res) {
  pg.query("SELECT * FROM users")
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });

  users.get("nesh.patel1@gmail.com")
    .then(user => {
      console.log('User', user);
    })
    .catch(err => {
      console.log("Error", err.toString());
    });

    users.get("x@gmail.com")
    .then(user => {
      console.log('User2', user);
    })
    .catch(err => {
      console.log("Error2", err.toString());
    })
  return res.send('User Page');
});

app.post('/user/new', function(req, res) {
  let data = req.body;
  users.get(data.email)
    .then(user => {
      if (user) return res.status(500).send({ error: "User with this email already exists." });
      return res.send({ dummy: "Test" });
    })
    .catch(err => {
      return res.status(500).send({ error: err.toString() });
    });
});

app.listen(global.config.server.port, function(){
  console.log('Node js Express js Tutorial');
});
