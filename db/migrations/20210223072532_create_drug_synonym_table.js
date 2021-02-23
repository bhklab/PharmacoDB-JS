exports.up = function (knex) {
    return knex.schema.hasTable('drug_synonym').then(exists => {
        if (!exists) {
            return knex.schema.createTable('drug_synonym', table => {
                table.increments('id').primary();
                table.integer('drug_id').unsigned().notNullable();
                table.string('drug_name').notNullable();
                table.foreign('drug_id').references('id').inTable('compound');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('drug_synonym');
};
