exports.up = function(knex) {
    return knex.schema.hasTable('target').then(exists => {
        if (!exists) {
            return knex.schema.createTable('target', table => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.integer('gene_id').unsigned();
                table
                    .foreign('gene_id')
                    .references('id')
                    .inTable('gene');
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('target');
};
