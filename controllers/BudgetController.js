'use strict';

const Budget = require('../models/budget');

const createBudget = async (req, res) => {
    const body = req.body;
    if (!body.budget || isNaN(body.budget)) {
        return badRequestError(res, 'Request expects a Budget Value!');
    }
    let data = {
        budget: body.budget,
        userId: req.user.id
    }
    let insertedBudget = await Budget.query().insertAndFetch(data);
    return createdResponse(res, insertedBudget, 'Budget created successfully!');
}

const getBudget = async (req, res) => {
    let budget = await Budget.query().where('userId', req.user.id);
    return okResponse(res, budget);
}

const updateBudget = async (req, res) => {
    let id = req.params.id;
    if (!+id) {
        return badRequestError(res, 'Request Expects an integer id!');
    }
    let category = await Budget.query().updateAndFetchById(+id, { budget: req.body.budget });;
    return okResponse(res, category);
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
    updateBudget,
    deleteBudget,
}