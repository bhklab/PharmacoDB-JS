const knex = require('../../db/knex');

/**
 * Returns the transformed data for all the genes in the database.
 */
const genes = async () => {
    try {
        const genes = await knex.select().from('genes');
        return genes.map(gene => {
            return {
                id: gene.gene_id,
                name: gene.gene_name
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    genes
};
