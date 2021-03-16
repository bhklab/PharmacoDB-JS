exports.up = function (knex) {
    return knex.schema.hasTable('gene_drug').then(exists => {
        if (!exists) {
            return knex.schema.createTable('gene_drug', table => {
                table.integer('gene_id').unsigned().notNullable();
                table.integer('drug_id').unsigned().notNullable();
                table.decimal('estimate', 64, 16);
                table.decimal('se', 64, 16);
                table.integer('n').unsigned();
                table.decimal('tstat', 64, 16);
                table.decimal('fstat', 64, 16);
                table.decimal('pvalue', 64, 16);
                table.integer('df').unsigned();
                table.decimal('fdr', 64, 16);
                table.decimal('FWER_genes', 64, 16);
                table.decimal('FWER_drugs', 64, 16);
                table.decimal('FWER_all', 64, 16);
                table.decimal('BF_p_all', 64, 16);
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