exports.up = function (knex) {
    return knex.schema.hasTable('gene_annotation').then(exists => {
        if (!exists) {
            return knex.schema.createTable('gene_annotation', table => {
                table.integer('gene_id').unsigned().notNullable();
                table.string('symbol');
                table.bigInteger('gene_seq_start');
                table.bigInteger('gene_seq_end');
                table.foreign('gene_id').references('id').inTable('gene');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('gene_annotation');
};