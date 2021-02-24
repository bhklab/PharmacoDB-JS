exports.up = function (knex) {
    return knex.schema.hasTable('dataset_compound').then(exists => {
        if (!exists) {
            return knex.schema.createTable('dataset_compound', table => {
                table.integer('dataset_id').unsigned().notNullable();
                table.integer('compound_id').unsigned().notNullable();
                table.foreign('dataset_id').references('id').inTable('dataset');
                table.foreign('compound_id').references('id').inTable('compound');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dataset_compound');
};