const express = require('express');
const router = express.Router();

const utils = require(__dirname + '/../api/utils.js');

router.get('/', (_req, res, next) => {
  res.send(utils.serverUrl())
});

router.get('/appRedirect/:path/:token', (req, res, _next) => {
  res.redirect('quizme://quizme/' + req.params.path + '/' + req.params.token);
});

module.exports = router;