exports.up = function (knex) {
    return knex.schema.hasTable('drug_annotation').then(exists => {
        if (!exists) {
            return knex.schema.createTable('drug_annotation', table => {
                table.integer('drug_id').unsigned().notNullable();
                table.string('smiles');
                table.string('inchikey');
                table.string('pubchem');
                table.boolean('fda_status');
                table.foreign('drug_id').references('id').inTable('compound');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('drug_annotation');
};