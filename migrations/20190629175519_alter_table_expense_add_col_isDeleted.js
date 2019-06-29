exports.up = function (knex, Promise) {
    return knex.schema.table('expense', table => {
        table
            .boolean('isDeleted').defaultTo(false);
    });
};

exports.down = function (knex, Promise) {

};
