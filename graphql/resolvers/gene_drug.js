const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { transformFdaStatus } = require('../../helpers/dataHelpers');

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
            pvalue,
            df,
            fdr,
            FWER_genes,
            FWER_drugs,
            FWER_all,
            BF_p_all,
            mDataType,
            level,
            drug_like_molecule,
            in_clinical_trials,
            dataset_id,
            dataset_name,
            drug_name,
            smiles,
            inchikey,
            pubchem,
            fda_status,
            tissue_id,
            tissue_name,
        } = gene_drug;
        return {
            id,
            geneId: gene_id,
            estimate,
            se,
            n,
            tstat,
            fstat,
            pvalue,
            df,
            fdr,
            FWER_genes,
            FWER_drugs,
            FWER_all,
            BF_p_all,
            mDataType,
            level,
            drug_like_molecule,
            in_clinical_trials,
            dataset: {
                id: dataset_id,
                name: dataset_name
            },
            compound: {
                id: drug_id,
                name: drug_name,
                annotation: {
                    smiles,
                    inchikey,
                    pubchem,
                    fda_status: transformFdaStatus(fda_status)
                }
            },
            tissue: {
                id: tissue_id,
                name: tissue_name
            },
        };
    });
};

/**
 * Returns the transformed data for all the compounds in the database.
 * @param {Object} data - Parameters for the data.
 * @param {number} [data.geneId = 1] - GeneId for the query.
 * @param {number} [data.compoundId = 1] - CompoundId for the query.
 * @param {number} [data.page = 1] - Current page number.
 * @param {number} [data.per_page = 20] - Total values per page.
 * @param {boolean} [data.all = false] - Boolean value whether to show all the data or not.
 */
const gene_drug = async ({ geneId, compoundId, page = 1, per_page = 20, all = false}) => {
    if (!geneId && !compoundId) throw new Error('Ivalid input! Query must include geneId or compoundId'); 
    try {
        const { limit, offset } = calcLimitOffset(page, per_page);
        let baseQuery = knex.select('id',
            'gene_id',
            'estimate',
            'se',
            'n',
            'tstat',
            'fstat',
            'pvalue',
            'dataset_name',
            'drug_name',
            'smiles',
            'inchikey',
            'pubchem',
            'fda_status',
            'tissue_name',
            'df',
            'fdr',
            'FWER_genes',
            'FWER_drugs',
            'FWER_all',
            'BF_p_all',
            'mDataType',
            'level',
            'drug_like_molecule',
            'in_clinical_trials',
            'datasets.dataset_id as dataset_id',
            'drugs.drug_id as drug_id',
            'tissues.tissue_id as tissue_id')
            .from('gene_drugs');

        if (geneId) baseQuery = baseQuery.where({ gene_id: geneId });
        if (compoundId) baseQuery = geneId 
            ? baseQuery.andWhere({ 'gene_drugs.drug_id': compoundId }) 
            : baseQuery.where({ 'gene_drugs.drug_id': compoundId });
        if (!all) baseQuery = baseQuery.limit(limit).offset(offset);

        const geneDrugs = await baseQuery
            .join('datasets', 'datasets.dataset_id', 'gene_drugs.dataset_id')
            .join('drugs', 'drugs.drug_id', 'gene_drugs.drug_id')
            .join('drug_annots', 'drug_annots.drug_id', 'gene_drugs.drug_id')
            .join('tissues', 'tissues.tissue_id', 'gene_drugs.tissue_id');
        return transformGeneDrugs(geneDrugs);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    gene_drug
};