'use strict';

const Expense = require('../models/budget');

const createExpense = async (req, res) => {
    const body = req.body;
    if (!body.expense || isNaN(body.expense)) {
        return badRequestError(res, 'Request expects a Expense Value!');
    }
    if (!+body.categoryId) {
        return badRequestError(res, 'Request expects a Category Id!');
    }
    const catExists = await Category.query().findById(+body.categoryId).first();
    if (!catExists) {
        return notFoundError(res, 'No category found with this id');
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
    let budget = await Expense.query().where('userId', req.user.id);
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

module.exports = {
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
}