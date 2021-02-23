exports.up = function (knex) {
    return knex.schema.hasTable('dataset_statistics').then(exists => {
        if (!exists) {
            return knex.schema.createTable('dataset_statistics', table => {
                table.increments('id').primary();
                table.integer('dataset_id').unsigned().notNullable();
                table.integer('cell_lines').unsigned().notNullable();
                table.integer('tissues').unsigned().notNullable();
                table.integer('drugs').unsigned().notNullable();
                table.integer('experiments').unsigned().notNullable();
                table.foreign('dataset_id').references('id').inTable('dataset');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dataset_statistics');
};
