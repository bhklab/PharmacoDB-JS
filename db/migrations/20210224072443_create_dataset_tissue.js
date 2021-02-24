exports.up = function (knex) {
    return knex.schema.hasTable('dataset_tissue').then(exists => {
        if (!exists) {
            return knex.schema.createTable('dataset_tissue', table => {
                table.integer('dataset_id').unsigned().notNullable();
                table.integer('tissue_id').unsigned().notNullable();
                table.foreign('dataset_id').references('id').inTable('dataset');
                table.foreign('tissue_id').references('id').inTable('tissue');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dataset_tissue');
};