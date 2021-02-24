exports.up = function (knex) {
    return knex.schema.hasTable('gene_drug').then(exists => {
        if (!exists) {
            return knex.schema.createTable('gene_drug', table => {
                table.integer('gene_id').unsigned().notNullable();
                table.integer('drug_id').unsigned().notNullable();
                table.float('estimate');
                table.float('se'); // should i use float to store double
                table.integer('n').unsigned();
                table.float('tstat');
                table.float('fstat');
                table.float('pvalue');
                table.integer('df').unsigned();
                table.float('fdr');
                table.float('FWER_genes');
                table.float('FWER_drugs');
                table.float('FWER_all');
                table.float('BF_p_all');
                table.boolean('meta_res');
                table.integer('dataset_id').unsigned().notNullable();
                table.string('sens_stat');
                table.integer('tissue_id').unsigned().notNullable();
                table.string('mDataType');
                table.boolean('tested_in_human_trials');
                table.boolean('in_clinical_trials');
                table.increments('id').primary();
                table.foreign('gene_id').references('id').inTable('gene');
                table.foreign('drug_id').references('id').inTable('compound');
                table.foreign('dataset_id').references('id').inTable('dataset');
                table.foreign('tissue_id').references('id').inTable('tissue');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('gene_drug');
};