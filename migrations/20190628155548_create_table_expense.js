exports.up = async (knex, Promise) => {

    try {
        await knex.schema
            .createTable('expense', table => {
                table.increments('id').primary();
                table.integer('expense').notNullable()
                table.integer('categoryId')
                    .references('id')
                    .inTable('category')
                    .notNullable()
                    .onDelete('CASCADE');
                table.integer('userId')
                    .references('id')
                    .inTable('user')
                    .notNullable()
                    .onDelete('CASCADE');
                table.timestamps(false, true);
            });
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};

exports.down = knex => {
    return knex.schema.dropTableIfExists('expense');
};
