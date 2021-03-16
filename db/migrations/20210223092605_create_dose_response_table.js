exports.up = function (knex) {
    return knex.schema.hasTable('dose_response').then(exists => {
        if (!exists) {
            return knex.schema.createTable('dose_response', table => {
                table.increments('id').primary();
                table.integer('experiment_id').unsigned().notNullable();
                table.float('dose', 12, 6).notNullable();
                table.float('response', 12, 6).notNullable();
                table.foreign('experiment_id').references('id').inTable('experiment');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('dose_response');
};
