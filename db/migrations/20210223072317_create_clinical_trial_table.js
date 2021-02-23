exports.up = function(knex) {
    return knex.schema.hasTable('clinical_trial').then(exists => {
        if (!exists) {
            return knex.schema.createTable('clinical_trial', table => {
                table.string('clinical_trial_id').primary(); // need to check on this
                table.string('nct').notNullable();
                table.string('link');
                table.string('status').notNullable();
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clinical_trial');
};