exports.up = function(knex) {
    return knex.schema.hasTable('drug_trial').then(exists => {
        if (!exists) {
            return knex.schema.createTable('drug_trial', table => {
                table.integer('clinical_trial_id').unsigned().notNullable();
                table.integer('drug_id').unsigned().notNullable();
                table.foreign('clinical_trial_id').references('clinical_trial_id').inTable('clinical_trial');
                table.foreign('drug_id').references('id').inTable('compound');
            });
        }
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('drug_trial');
};
