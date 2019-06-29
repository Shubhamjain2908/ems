'use strict';

const Expense = require('../models/expense');
const Budget = require('../models/budget');
const Category = require('../models/category');

const createExpense = async (req, res) => {
    const body = req.body;
    const expense = body.expense;
    if (!expense || isNaN(expense)) {
        return badRequestError(res, 'Request expects a Expense Value!');
    }
    if (!+body.categoryId) {
        return badRequestError(res, 'Request expects a Category Id!');
    }
    const catExists = await Category.query().findById(+body.categoryId).first();
    if (!catExists) {
        return notFoundError(res, 'No category found with this id');
    }
    const totalBudget = await Budget.query().select('budget').where('userId', req.user.id).first().then(a => {
        return a.budget;
    });

    const usedBudget = await Expense.query().sum('expense').where('userId', req.user.id).first().then(a => {
        if (a.sum == null) {
            return 0;
        } else {
            return a.sum;
        }
    });
    if (!totalBudget) {
        return badRequestError(res, 'No budget was found of this user');
    }

    if (totalBudget - usedBudget - expense < 0) {
        return badRequestError(res, 'You have exceeded your limit of purchase! Available balance is : ' + (totalBudget - usedBudget) + '.');
    }

    let data = {
        expense: body.expense,
        userId: req.user.id,
        categoryId: body.categoryId
    }

    let insertedExpense = await Expense.query().insertAndFetch(data);
    return createdResponse(res, insertedExpense, 'Expense created successfully!');
}

const getExpense = async (req, res) => {
    let budget = await Expense.query().where('userId', req.user.id).eager('[category]').modifyEager('category', e => {
        e.eager('[parent]');
    });
    return okResponse(res, budget);
}

const updateExpense = async (req, res) => {
    let id = req.params.id;
    if (!+id) {
        return badRequestError(res, 'Request Expects an integer id!');
    }
    let category = await Expense.query().updateAndFetchById(+id, { expense: req.body.expense });;
    return okResponse(res, category);
}

const deleteExpense = async (req, res) => {
    let id = req.params.id;
    if (!id || isNaN(id)) {
        return badRequestError(res, 'Request expects an Integer Id!');
    }
    const exists = await Expense.query().where('id', id).first();
    if (exists) {
        await exists.$query().delete();
        return noContentResponse(res);
    } else {
        return badRequestError(res, 'No Expense exist with this id!');
    }
}

const dashboard = async (req, res) => {
    const totalBudget = await Budget.query().select('budget').where('userId', req.user.id).first().then(a => {
        return a.budget;
    });

    const usedBudget = await Expense.query().sum('expense').where('userId', req.user.id).first().then(a => {
        if (a.sum == null) {
            return 0;
        } else {
            return +a.sum;
        }
    });

    const totalCategory = await Category.query().count('id').where('parentId', null).then(a => {
        return +a[0].count;
    });

    const budgetUsed_percentage = Math.round((usedBudget / totalBudget) * 100 * 100) / 100;
    const budgetLeft_percentage = 100 - budgetUsed_percentage;

    let data = {
        totalBudget: totalBudget,
        usedBudget: usedBudget,
        budgetLeft: totalBudget - usedBudget,
        totalCategory: totalCategory,
        budgetUsed_percentage: budgetUsed_percentage,
        budgetLeft_percentage: budgetLeft_percentage
    }

    return okResponse(res, data);
}

module.exports = {
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
    dashboard
}