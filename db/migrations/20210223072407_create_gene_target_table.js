exports.up = function (knex) {
    return knex.schema.hasTable('gene_target').then(exists => {
        if (!exists) {
            return knex.schema.createTable('gene_target', table => {
                table.integer('gene_id').unsigned().notNullable();
                table.integer('target_id').unsigned().notNullable();
                table.foreign('gene_id').references('id').inTable('gene');
                table.foreign('target_id').references('id').inTable('target');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('gene_target');
};