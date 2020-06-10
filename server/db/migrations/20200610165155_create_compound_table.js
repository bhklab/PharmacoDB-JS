exports.up = function(knex) {
    return knex.schema
        .hasTable('compounds')
        .then(exists => {
            if (!exists) {
                return knex.schema.createTable('compounds', table => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                });
            }
        })
        .catch(err => {
            throw err;
        });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('compounds');
};
