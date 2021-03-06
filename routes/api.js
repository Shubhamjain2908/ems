'use strict';

const passport = require('passport');
require('../middleware/passport')(passport);
const express = require('express');
const router = express.Router();

const Auth = require('../controllers/AuthController');
const Category = require('../controllers/CategoryController');
const Budget = require('../controllers/BudgetController');
const Expense = require('../controllers/ExpenseController');

/***********************
  Auth Routes
***********************/
router.post('/signup', Auth.signUp);
router.post('/login', Auth.login);
router.delete('/logout', passport.authenticate('jwt', { session: false }), Auth.logout);
router.get('/user', passport.authenticate('jwt', { session: false }), Auth.getUser);
router.put('/user', passport.authenticate('jwt', { session: false }), Auth.updateUser);
/***********************
  Auth Routes
***********************/

/***********************
  Category Routes
***********************/
router.post('/category', passport.authenticate('jwt', { session: false }), Category.createCategory);
router.get('/category', Category.getCategories);
router.get('/subcategory', Category.getSubCategories);
router.get('/subcategory/:categoryId', Category.getCategoryByParentId);
router.put('/category/:id', passport.authenticate('jwt', { session: false }), Category.updateCategory);
router.delete('/category/:id', passport.authenticate('jwt', { session: false }), Category.deleteCategory);
/***********************
  Category Routes
***********************/

/***********************
  Budget Routes
***********************/
router.post('/budget', passport.authenticate('jwt', { session: false }), Budget.createBudget);
router.get('/budget', passport.authenticate('jwt', { session: false }), Budget.getBudget);
router.delete('/budget/:id', passport.authenticate('jwt', { session: false }), Budget.deleteBudget);
/***********************
  Budget Routes
***********************/

/***********************
  Expense Routes
***********************/
router.post('/expense', passport.authenticate('jwt', { session: false }), Expense.createExpense);
router.get('/expense', passport.authenticate('jwt', { session: false }), Expense.getExpense);
router.put('/expense/:id', passport.authenticate('jwt', { session: false }), Expense.updateExpense);
router.delete('/expense/:id', passport.authenticate('jwt', { session: false }), Expense.deleteExpense);
/***********************
  Expense Routes
***********************/
router.get('/dashboard', passport.authenticate('jwt', { session: false }), Expense.dashboard);

module.exports = router;
