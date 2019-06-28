exports.up = async (knex, Promise) => {

    try {
        await knex.schema.createTable('category', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.unique('name');
            table.integer('parentId')
                .references('id')
                .inTable('category')
                .onDelete('CASCADE');
            table.timestamps(false, true);
        });
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
};

exports.down = knex => {
    return knex.schema.dropTableIfExists('category');
};
