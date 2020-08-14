const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformGeneDrugs = data => {
    return data.map(gene_drug => {
        const {
            id,
            gene_id,
            drug_id,
            estimate,
            se,
            n,
            tstat,
            fstat,
            pvalue
        } = gene_drug;
        return {
            id,
            geneId: gene_id,
            drugId: drug_id,
            estimate,
            se,
            n,
            tstat,
            fstat,
            pvalue
        };
    });
};

/**
 * Returns the transformed data for all the gene_drugs in the database that mathces specified query.
 */
const gene_drug = async ({ geneId, drugId, page = 1, per_page = 20, all = false}) => {
    if (!geneId && !drugId) throw new Error('Ivalid input! Query must include geneId or drugId'); 
    try {
        const { limit, offset } = calcLimitOffset(page, per_page);
        let baseQuery = knex.select('id',
            'gene_id',
            'drug_id',
            'estimate',
            'se',
            'n',
            'tstat',
            'fstat',
            'pvalue')
            .from('gene_drugs');

        if (geneId) baseQuery = baseQuery.where({ gene_id: geneId });
        if (drugId) baseQuery = baseQuery.where({ drug_id: drugId });
        if (!all) baseQuery = baseQuery.limit(limit).offset(offset);

        const geneDrugs = await baseQuery;
        return transformGeneDrugs(geneDrugs);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    gene_drug
};