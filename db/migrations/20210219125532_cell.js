exports.up = function (knex) {
    return knex.schema.hasTable('cell')
        .then(exists => {
            if (!exists) {
                return knex.schema.createTable('cell', table => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
                    table.integer('tissue_id').unsigned();
                    table
                        .foreign('tissue_id')
                        .references('id')
                        .inTable('tissue');
                });
            }
        })
        .catch(err => {
            throw err;
        })
        .finally(() => {
            knex.destroy();
        });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('cell');
};
