exports.up = function(knex) {
    return knex.schema.hasTable('gene').then(exists => {
        if (!exists) {
            return knex.schema.createTable('gene', table => {
                table.increments('id').primary();
                table.string('name').notNullable();
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('gene');
};
