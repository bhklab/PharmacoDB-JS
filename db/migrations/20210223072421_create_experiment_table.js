exports.up = function (knex) {
    return knex.schema.hasTable('experiment').then(exists => {
        if (!exists) {
            return knex.schema.createTable('experiment', table => {
                table.increments('id').primary();
                table.integer('cell_id').unsigned().notNullable();
                table.integer('drug_id').unsigned().notNullable();
                table.integer('dataset_id').unsigned().notNullable();
                table.integer('tissue_id').unsigned().notNullable();
                table.foreign('cell_id').references('id').inTable('cell');
                table.foreign('drug_id').references('id').inTable('compound');
                table.foreign('dataset_id').references('id').inTable('dataset');
                table.foreign('tissue_id').references('id').inTable('tissue');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('experiment');
};