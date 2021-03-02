exports.up = function(knex) {
    return knex.schema.hasTable('clinical_trial').then(exists => {
        if (!exists) {
            return knex.schema.createTable('clinical_trial', table => {
                table.increments('clinical_trial_id').primary();
                table.string('nct').notNullable();
                table.text('link');
                table.string('status').notNullable();
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clinical_trial');
};