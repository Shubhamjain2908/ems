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

    const c = await checkBudget(req.user.id, expense);
    if (c && c.limit) {
        return badRequestError(res, 'You have exceeded your limit of purchase! Available balance is : ' + (c.limit) + '.');
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
    let page = (req.query.page) ? req.query.page : 1;
    let limit = (req.query.limit) ? req.query.limit : 10;
    let offset = 10 * (page - 1);
    let budget = await Expense.query().where('userId', req.user.id).eager('[category]').modifyEager('category', e => {
        e.eager('[parent]');
    }).limit(limit).offset(offset).orderBy('id', 'DESC');
    return okResponse(res, budget);
}

const updateExpense = async (req, res) => {
    let id = req.params.id, body = req.body;
    if (!+id) {
        return badRequestError(res, 'Request Expects an integer id!');
    }
    if (body.expense) {
        const c = await checkBudget(req.user.id, body.expense);
        if (c && c.limit) {
            return badRequestError(res, 'You have exceeded your limit of purchase! Available balance is : ' + (c.limit) + '.');
        }
    }
    let category = await Expense.query().updateAndFetchById(+id, body);;
    return okResponse(res, category);
}

const deleteExpense = async (req, res) => {
    let id = req.params.id;
    if (!id || isNaN(id)) {
        return badRequestError(res, 'Request expects an Integer Id!');
    }
    const exists = await Expense.query().where('id', id).first();
    if (exists) {
        const e = await Expense.query().patchAndFetchById(id, { isDeleted: true });
        return okResponse(res, e);
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
    const budgetLeft_percentage = Math.round((100 - budgetUsed_percentage) * 100) / 100;

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

const checkBudget = async (id, expense) => {
    const totalBudget = await Budget.query().select('budget').where('userId', id).first().then(a => {
        return a.budget;
    });

    const usedBudget = await Expense.query().sum('expense').where('userId', id).first().then(a => {
        if (a.sum == null) {
            return 0;
        } else {
            return a.sum;
        }
    });

    if (totalBudget - usedBudget - expense < 0) {
        return {
            limit: totalBudget - usedBudget
        };
    } else {
        return null;
    }
}

module.exports = {
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
    dashboard
}