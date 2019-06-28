const Model = require('objection').Model;

class Budget extends Model {

    static get tableName() {
        return 'budget';
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/User',
                join: {
                    from: 'budget.userId',
                    to: 'user.id'
                }
            },
        }
    }
}

module.exports = Budget;