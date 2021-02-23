exports.up = function (knex) {
    return knex.schema.hasTable('tissue_synonym').then(exists => {
        if (!exists) {
            return knex.schema.createTable('tissue_synonym', table => {
                table.increments('id').primary();
                table.integer('tissue_id').unsigned().notNullable();
                table.string('tissue_name').notNullable();
                table.foreign('tissue_id').references('id').inTable('tissue');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tissue_synonym');
};
