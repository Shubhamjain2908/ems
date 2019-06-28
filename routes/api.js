'use strict';

const passport = require('passport');
require('../middleware/passport')(passport);
const express = require('express');
const router = express.Router();

const Auth = require('../controllers/AuthController');
const Category = require('../controllers/CategoryController');

/***********************
  Auth Routes
***********************/
router.post('/signup', Auth.signUp);
router.post('/login', Auth.login);
router.get('/logout', passport.authenticate('jwt', { session: false }), Auth.logout);
/***********************
  Auth Routes
***********************/

/***********************
  Category Routes
***********************/
router.post('/category', passport.authenticate('jwt', { session: false }), Category.createCategory);
router.post('/subcategory', passport.authenticate('jwt', { session: false }), Category.createSubCategory);
router.get('/category', Category.getCategories);
router.get('/category/:id', Category.getCategoryById);
router.put('/category/:id', passport.authenticate('jwt', { session: false }), Category.updateCategory);
router.delete('/category/:id', passport.authenticate('jwt', { session: false }), Category.deleteCategory);
/***********************
  Category Routes
***********************/

module.exports = router;
