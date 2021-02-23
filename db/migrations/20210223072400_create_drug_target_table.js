exports.up = function (knex) {
    return knex.schema.hasTable('drug_target').then(exists => {
        if (!exists) {
            return knex.schema.createTable('drug_target', table => {
                table.integer('drug_id').unsigned().notNullable();
                table.integer('target_id').unsigned().notNullable();
                table.foreign('drug_id').references('id').inTable('compound');
                table.foreign('target_id').references('id').inTable('target');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('drug_target');
};