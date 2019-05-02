global.config = require(__dirname + '/../.config/config.json');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const utils = require(__dirname + '/api/utils.js');
const email = require(__dirname + '/api/email.js');
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
  res.send({test: 'Hello World'});
});

app.get('/session', function (req, res) {
  res.send({ session: req.session.user });
});

app.get('/session/logout', function(req, res) {
  if (req.session.user) {
    console.log('Logging out ' + req.session.user.email + '...');
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
        return utils.error(res, err);
      }
      return res.send({ success: true });
    });
  } else {
    return res.send({});
  }
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

app.get('/email', function(req, res) {
  email.send('nesh.patel1@gmail.com', 'Test Email', 'This is some text')
    .then(data => {
      console.log('Success', data);
      return res.send("Email succeeded");
    }).catch(err => {
      console.log('Error', err);
      return res.send("Email failed");
    });
});

app.post('/user/new', function(req, res) {
  let data = req.body;
  if (!data.email) return utils.error(res, "Email is required.");
  if (!data.password) return utils.error(res, "Password is required.");

  let newUser = new users.User(data.email, data.name);
  users.get(data.email)
    .then(user => {
      if (user) return utils.error(res, "User with this email already exists.");
      users.new(newUser, data.password)
        .then(() => { 
          console.log('Successfully created user ' + data.email);
          req.session.user = newUser;
          return res.send({ success: true }) 
        })
        .catch(err => { 
          console.error('Error creating user:');
          return utils.error(res, err) 
        });
    })
    .catch(err => { return utils.error(res, err) });
});

app.post('/user/auth', function(req, res) {
  let data = req.body;
  if (!data.email) return utils.error(res, "Email is required.");
  if (!data.password) return utils.error(res, "Password is required.");

  users.get(data.email)
    .then(user => {
      if (!user) return utils.error(res, "No user with email " + data.email + " exists.");
      users.auth(data.email, data.password)
        .then(result => { 
          req.session.user = user;
          return res.send({ success: result });
        })
        .catch(err => { return utils.error(res, err) })
    })
    .catch(err => { return utils.error(res, err) })
});

app.listen(global.config.server.port, function(){
  console.log('QuizMe Server Started');
});
