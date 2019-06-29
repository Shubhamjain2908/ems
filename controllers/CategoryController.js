'use strict';

const Category = require('../models/category');

const createCategory = async (req, res) => {
    const body = req.body;
    if (!body.name) {
        return badRequestError(res, 'Request expects a Category Name!');
    }
    let data = {
        name: body.name
    }
    if (body.parentId) {
        const categoryExists = await Category.query().where('id', body.parentId).first();
        if (!categoryExists) {
            return notFoundError(res, 'No category found with id: ' + body.parentId);
        }
        data.parentId = body.parentId;
    }
    let insertedCategory = await Category.query().insertAndFetch(data);
    return createdResponse(res, insertedCategory, 'Category created successfully!');
}

const getCategories = async (req, res) => {
    let category = await Category.query().where('parentId', null).eager('[children]');
    return okResponse(res, category);
}

const getSubCategories = async (req, res) => {
    let category = await Category.query().whereNot('parentId', null).eager('[parent]');
    return okResponse(res, category);
}

const getCategoryByParentId = async (req, res) => {
    let id = req.params.categoryId;
    if (!+id) {
        return badRequestError(res, 'Request Expects an integer id!');
    }
    let category = await Category.query().where('parentId', +id);
    if (!category) {
        return notFoundError(res, 'not Found!');
    }
    return okResponse(res, category);
}

const updateCategory = async (req, res) => {
    let id = req.params.id, data = {};
    if (!+id) {
        return badRequestError(res, 'Request Expects an integer id!');
    }
    const body = req.body;
    if (body.name) {
        data.name = body.name;
    }
    if (body.parentId) {
        const categoryExists = await Category.query().where('id', body.parentId).first();
        if (!categoryExists) {
            return notFoundError(res, 'No category found with id: ' + body.parentId);
        }
        data.parentId = body.parentId;
    }
    let category = await Category.query().updateAndFetchById(+id, data);;
    return okResponse(res, category);
}

const deleteCategory = async (req, res) => {
    let id = req.params.id;
    if (!id || isNaN(id)) {
        return badRequestError(res, 'Request expects an Integer Id!');
    }
    const categoryExists = await Category.query().where('id', id).first();
    if (categoryExists) {
        await Category.query().where('parentId', id);
        await categoryExists.$query().delete();
        return noContentResponse(res);
    } else {
        return badRequestError(res, 'No Category exist with this id!');
    }
}

module.exports = {
    createCategory,
    getCategories,
    getSubCategories,
    getCategoryByParentId,
    updateCategory,
    deleteCategory,
}