exports.up = function (knex) {
    return knex.schema.hasTable('dataset')
        .then(exists => {
            if (!exists) {
                return knex.schema.createTable('dataset', table => {
                    table.increments('id').primary();
                    table.string('name').notNullable();
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
    return knex.schema.dropTableIfExists('dataset');
};