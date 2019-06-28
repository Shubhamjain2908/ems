'use strict';

const passport = require('passport');
require('../middleware/passport')(passport);
const express = require('express');
const router = express.Router();

const Auth = require('../controllers/AuthController');
const User = require('../controllers/UserController');
const Tweet = require('../controllers/TweetController');


/***********************
  Auth Routes
***********************/
router.post('/signup', Auth.signUp);
router.post('/login', Auth.login);
router.get('/logout', passport.authenticate('jwt', { session: false }), Auth.logout);
/***********************
  Auth Routes
***********************/

module.exports = router;
