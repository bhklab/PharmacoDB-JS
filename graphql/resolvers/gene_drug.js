const knex = require('../../db/knex');
// const {
//   transformObject
// } = require('../../helpers/transformObject');

/**
 * Returns the transformed data for all the genes in the database.
 */
// TODO: the code has to be changed in future when new database will be in place.
const gene_drug = async args => {
    const {
        geneId,
        drugId
    } = args;
    if (!geneId && !drugId) throw new Error('Ivalid input! Query must include geneId or drugId'); 
    try {
        const geneDrugs = await knex.select().from('gene_drugs').limit(10);
        console.log(geneDrugs);
        return [{geneId: 1, drugId: 1}];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    gene_drug
};