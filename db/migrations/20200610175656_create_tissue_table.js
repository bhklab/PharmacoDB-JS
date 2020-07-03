exports.up = function(knex) {
    return knex.schema.hasTable('tissue').then(exists => {
        if (!exists) {
            return knex.schema.createTable('tissue', table => {
                table.increments('id').primary();
                table.string('name').notNullable();
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tissue');
};
