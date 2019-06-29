'use strict';

const Budget = require('../models/budget');

const createBudget = async (req, res) => {
    const body = req.body;
    const id = +req.user.id;
    if (!body.budget || isNaN(body.budget)) {
        return badRequestError(res, 'Request expects a Budget Value!');
    }
    let budgetExists = await Budget.query().where('userId', id).first();
    if (budgetExists) {
        let updateBudget = await Budget.query().updateAndFetchById(id, { budget: body.budget });
        return createdResponse(res, updateBudget, 'Budget updated successfully!');
    } else {
        let data = {
            budget: body.budget,
            userId: id
        }
        let insertedBudget = await Budget.query().insertAndFetch(data);
        return createdResponse(res, insertedBudget, 'Budget created successfully!');
    }
}

const getBudget = async (req, res) => {
    let budget = await Budget.query().where('userId', req.user.id).first();
    return okResponse(res, budget);
}

const deleteBudget = async (req, res) => {
    let id = req.params.id;
    if (!id || isNaN(id)) {
        return badRequestError(res, 'Request expects an Integer Id!');
    }
    const exists = await Budget.query().where('id', id).first();
    if (exists) {
        await exists.$query().delete();
        return noContentResponse(res);
    } else {
        return badRequestError(res, 'No Budget exist with this id!');
    }
}

module.exports = {
    createBudget,
    getBudget,
    deleteBudget,
}