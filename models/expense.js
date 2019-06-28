const Model = require('objection').Model;

class Expense extends Model {

    static get tableName() {
        return 'expense';
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'expense.userId',
                    to: 'user.id'
                }
            },
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Category',
                join: {
                    from: 'expense.categoryId',
                    to: 'category.id'
                }
            },
        }
    }
}

module.exports = Expense;