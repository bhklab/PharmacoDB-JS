exports.up = function (knex) {
    return knex.schema.hasTable('mol_cell').then(exists => {
        if (!exists) {
            return knex.schema.createTable('mol_cell', table => {
                table.increments('id').primary();
                table.integer('cell_id').unsigned().notNullable();
                table.integer('dataset_id').unsigned().notNullable();
                table.string('mDataType').notNullable();
                table.integer('num_prof').unsigned().notNullable();
                table.foreign('cell_id').references('id').inTable('cell');
                table.foreign('dataset_id').references('id').inTable('dataset');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('mol_cell');
};
