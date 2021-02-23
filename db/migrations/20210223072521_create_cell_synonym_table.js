exports.up = function (knex) {
    return knex.schema.hasTable('cell_synonym').then(exists => {
        if (!exists) {
            return knex.schema.createTable('cell_synonym', table => {
                table.increments('id').primary();
                table.integer('cell_id').unsigned().notNullable();
                table.string('cell_name').notNullable();
                table.foreign('cell_id').references('id').inTable('cell');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('cell_synonym');
};

