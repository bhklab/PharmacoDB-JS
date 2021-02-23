exports.up = function (knex) {
    return knex.schema.hasTable('dataset_cell').then(exists => {
        if (!exists) {
            return knex.schema.createTable('dataset_cell', table => {
                table.integer('dataset_id').unsigned().notNullable();
                table.integer('cell_id').unsigned().notNullable();
                table.foreign('dataset_id').references('id').inTable('dataset');
                table.foreign('cell_id').references('id').inTable('cell');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dataset_cell');
};