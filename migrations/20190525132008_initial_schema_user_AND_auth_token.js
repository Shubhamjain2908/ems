exports.up = async (knex, Promise) => {

    try {

        await knex.schema.createTable('user', table => {
            table.increments('id').primary();
            table.string('email').notNullable();
            table.unique('email');
            table.string('name');
            table.string('mobile');
            table.text('address');
            table.string('password');
        });

        await knex.schema.createTable('auth_token', table => {
            table.increments('id', 11).primary();
            table.text('token').notNullable();
            table.integer('userId', 11)
                .unsigned()
                .references('id')
                .inTable('user')
                .onDelete('CASCADE');
            table.timestamps(false, true);
        });

        return Promise.resolve();

    } catch (e) {
        return Promise.reject(e);
    }
};

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('user')
        .dropTableIfExists('auth_token')

};
