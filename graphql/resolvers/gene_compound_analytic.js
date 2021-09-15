const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { transformFdaStatus } = require('../../helpers/dataHelpers');
const { retrieveFields } = require('../../helpers/queryHelpers');
const { getIdBasedOnCompound } = require('./compound');
const { getIdBasedOnGene } = require('./gene');
const { getIdBasedOnTissue } = require('./tissue');


/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformGeneCompounds = (data) => {
    return data.map(compound_compound => {
        const {
            gct_id, compound_id, estimate, lower_analytic, upper_analytic,
            n, pvalue_analytic, df, upper_permutation, lower_permutation,
            sens_stat, mDataType, compound_name, compound_uid,
            pvalue_permutation, fdr_analytic, fdr_permutation,
            significant_permutation, permutation_done,
            smiles, inchikey, pubchem, fda_status, tissue_id,
            tissue_name, gene_id, gene_name, symbol, chr, gene_seq_start, gene_seq_end,
            dataset_id, dataset_name
        } = compound_compound;
        return {
            id: gct_id,
            estimate,
            lower_analytic,
            upper_analytic,
            upper_permutation,
            lower_permutation,
            n,
            pvalue_permutation,
            pvalue_analytic,
            df,
            fdr_analytic,
            fdr_permutation,
            significant_permutation,
            permutation_done,
            sens_stat,
            mDataType,
            gene: {
                id: gene_id,
                name: gene_name,
                annotation: {
                    gene_id,
                    symbol,
                    chr,
                    gene_seq_start,
                    gene_seq_end
                }
            },
            compound: {
                id: compound_id,
                uid: compound_uid,
                name: compound_name,
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
            dataset: {
                id: dataset_id,
                name: dataset_name
            }
        };
    });
};

/**
 * Maps dataset object to each gene_compound data rows by dataset_id
 * @param {*} data // gene_compound data 
 * @param {*} datasets // list of dataset objects
 * @returns a complete GraphQL formatted data to be returned.
 */
const mapDataset = (data, datasets) => {
    return data.map(item => {
        let found = datasets.find(dataset => dataset.id === item.dataset.id);
        item.dataset = {
            id: found.id,
            name: found.name
        }
        return item;
    });
};

/**
 * Returns the transformed data for all the compounds in the database.
 * @param {Object} args - args object generated by GraphQL client.
 * @param {Object} context - parent object generated by GraphQL client (not used in the function).
 * @param {Object} info - info object generated by GraphQL client, contains data about requested fields.
 * @param {number} [args.geneId = 1] - GeneId for the query.
 * @param {number} [args.compoundId = 1] - CompoundId for the query.
 * @param {number} [args.page = 1] - Current page number.
 * @param {number} [args.per_page = 20] - Total values per page.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not.
 */
const gene_compound_dataset = async (args, context, info) => {
    // arguments
    let { geneId, geneName, compoundId, compoundName, page = 1, per_page = 20, all = false } = args;
    // grab the ids of each data type if data type is passed in the parameters
    geneId = geneName ? await getIdBasedOnGene(geneName) : geneId || null;
    compoundId = compoundName ? await getIdBasedOnCompound(compoundName) : compoundId;

    // check if the gene or compound id is passed?
    if (!geneId && !compoundId) throw new Error('Invalid input! Query must include geneId or compoundId');

    try {
        const { limit, offset } = calcLimitOffset(page, per_page);
        const listOfFields = retrieveFields(info);

        // creates list of columns and list of subtypes for the knex query builder based on the fields requested by graphQL client
        const columns = [];
        const subtypes = [];

        listOfFields.forEach(el => {
            switch (el.name) {
                case 'gene':
                    columns.push(...['gene.id as gene_id', 'gene.name as gene_name', 'gene_annotation.symbol as symbol', 'gene_seq_start', 'gene_seq_end']);
                    subtypes.push(el.name);
                    break;
                case 'compound':
                    columns.push(...['compound.id as compound_id', 'compound.compound_uid as compound_uid', 'compound.name as compound_name', 'smiles', 'inchikey', 'pubchem', 'fda_status']);
                    subtypes.push(el.name);
                    break;
                case 'dataset':
                    // columns.push(...['GD.dataset_id as dataset_id']);
                    columns.push(...['dataset.id as dataset_id', 'dataset.name as dataset_name']);
                    subtypes.push(el.name);
                    break;
                case 'id':
                    columns.push('GD.id as gct_id');
                    break;
                default:
                    columns.push(el.name);
                    break;
            }
        });

        let query = knex.select(columns).from('gene_compound_dataset as GD');
        // chooses table to select from
        if (geneId) query = query.where({ 'GD.gene_id': geneId });

        if (compoundId) query = geneId
            ? query.andWhere({ 'GD.compound_id': compoundId })
            : query.where({ 'GD.compound_id': compoundId });

        if (!all) query = query.limit(limit).offset(offset);

        // updates query to contain joins based on requested fields
        subtypes.forEach(subtype => {
            switch (subtype) {
                case 'gene':
                    query = query.join('gene', 'gene.id', 'GD.gene_id')
                        .join('gene_annotation', 'gene_annotation.gene_id', 'GD.gene_id');
                    break;
                case 'compound':
                    query = query.join('compound', 'compound.id', 'GD.compound_id')
                        .join('compound_annotation', 'compound_annotation.compound_id', 'GD.compound_id');
                    break;
                case 'dataset':
                    query = query.join('dataset', 'dataset.id', 'GD.dataset_id');
                    break;
            }
        });

        // transform and return the data.
        const geneCompoundResults = await query;
        return transformGeneCompounds(geneCompoundResults);
        // let transformed = transformGeneCompounds(geneCompoundResults);
        // let datasets = await knex.select(['id', 'name']).from('dataset'); // query all the datasets
        // return mapDataset(transformed, datasets); 
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for all the gene_compound_tissue_dataset data in the database.
 * @param {Object} args - args object generated by GraphQL client.
 * @param {Object} context - parent object generated by GraphQL client (not used in the function).
 * @param {Object} info - info object generated by GraphQL client, contains data about requested fields.
 * @param {number} [args.geneId = 1] - GeneId for the query.
 * @param {number} [args.compoundId = 1] - CompoundId for the query.
 * @param {number} [args.tissueId = 1] - TissueId for the query.
 * @param {number} [args.page = 1] - Current page number.
 * @param {number} [args.per_page = 20] - Total values per page.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not.
 */
const gene_compound_tissue_dataset = async (args, context, info) => {
    // arguments
    let { geneId, compoundId, tissueId, geneName, compoundName, tissueName, mDataType, page = 1, per_page = 200, all = false } = args;
    // grab the ids of each data type if data type is passed in the parameters
    geneId = geneName ? await getIdBasedOnGene(geneName) : geneId || null;
    compoundId = compoundName ? await getIdBasedOnCompound(compoundName) : compoundId;
    tissueId = tissueName ? await getIdBasedOnTissue(tissueName) : tissueId || null;

    // check if the gene or compound id is passed?
    if (!geneId && !compoundId && !tissueId) {
        throw new Error('Invalid Input! Query must include data type IDs or Names!');
    }

    try {
        const { limit, offset } = calcLimitOffset(page, per_page);
        const listOfFields = retrieveFields(info);

        // creates list of columns and list of subtypes for the knex query builder based on the fields requested by graphQL client
        const columns = [];
        const subtypes = [];

        listOfFields.forEach(el => {
            switch (el.name) {
                case 'gene':
                    columns.push(...['gene.id as gene_id', 'gene.name as gene_name', 'gene_seq_start', 'gene_seq_end', 'gene_annotation.symbol as symbol', 'gene_annotation.chr as chr']);
                    subtypes.push(el.name);
                    break;
                case 'compound':
                    columns.push(...['compound.id as compound_id', 'compound.compound_uid as compound_uid', 'compound.name as compound_name', 'smiles', 'inchikey', 'pubchem', 'fda_status']);
                    subtypes.push(el.name);
                    break;
                case 'tissue':
                    columns.push(...['tissue.id as tissue_id', 'tissue.name as tissue_name']);
                    subtypes.push(el.name);
                    break;
                case 'dataset':
                    columns.push(...['dataset.id as dataset_id', 'dataset.name as dataset_name']);
                    subtypes.push(el.name);
                    break;
                case 'id':
                    columns.push('GD.id as gct_id');
                    break;
                default:
                    columns.push(el.name);
                    break;
            }
        });
        
        let query = knex.select(columns).from('gene_compound_tissue_dataset as GD');
        // chooses table to select from
        if (geneId) query = query.where({ 'GD.gene_id': geneId });

        if (compoundId) query = geneId
            ? query.andWhere({ 'GD.compound_id': compoundId })
            : query.where({ 'GD.compound_id': compoundId });

        if (tissueId) query = compoundId ?
            query.andWhere({ 'GD.tissue_id': tissueId })
            : query.where({ 'GD.tissue_id': tissueId });

        // Add mDataType filter if it is present in request. Used for Biomarker page (Manhattan Plot)
        if (mDataType && mDataType.length > 0) query.andWhere({ 'GD.mDataType': mDataType });

        if (!all) query = query.limit(limit).offset(offset);

        // updates query to contain joins based on requested fields
        subtypes.forEach(subtype => {
            switch (subtype) {
                case 'gene':
                    query = query.join('gene', 'gene.id', 'GD.gene_id')
                        .join('gene_annotation', 'gene_annotation.gene_id', 'GD.gene_id');
                    break;
                case 'compound':
                    query = query.join('compound', 'compound.id', 'GD.compound_id')
                        .join('compound_annotation', 'compound_annotation.compound_id', 'GD.compound_id');
                    break;
                case 'tissue':
                    query = query.join('tissue', 'tissue.id', 'GD.tissue_id');
                    break;
                case 'dataset':
                    query = query.join('dataset', 'dataset.id', 'GD.dataset_id');
                    break;
            }
        });

        // transform and return the data.
        const geneCompoundResults = await query;
        return transformGeneCompounds(geneCompoundResults);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const gene_compound_dataset_biomarker = async (args, context, info) => {
    // arguments
    let { compoundId, compoundName, mDataType, page = 1, per_page = 200, all = false } = args;
    // grab the ids of each data type if data type is passed in the parameters
    compoundId = compoundName ? await getIdBasedOnCompound(compoundName) : compoundId;
    
    // check if the compound id is passed?
    if (!compoundId || !mDataType) {
        throw new Error('Invalid Input! Query must include data type IDs or Names!');
    }

    try {
        const { limit, offset } = calcLimitOffset(page, per_page);

        // creates list of columns and list of subtypes for the knex query builder based on the fields requested by graphQL client
        const columns = [
            'dataset_id',
            'fdr_analytic',
            'fdr_permutation',
            'mDataType',
            'gene.id as gene_id', 
            'gene.name as gene_name', 
            'gene_seq_start', 
            'gene_seq_end', 
            'gene_annotation.symbol as symbol', 
            'gene_annotation.chr as chr'
        ];
        
        let query = knex.select(columns)
            .from('gene_compound_dataset as GD')
            .join('gene', 'gene.id', 'GD.gene_id')
            .join('gene_annotation', 'gene_annotation.gene_id', 'GD.gene_id')
            .where({ 'GD.compound_id': compoundId })
            .andWhere({ 'GD.mDataType': mDataType });

        if (!all) query = query.limit(limit).offset(offset);

        // transform and return the data.
        const geneCompoundResults = await query;
        let transformed = transformGeneCompounds(geneCompoundResults);
        let datasets = await knex.select(['id', 'name']).from('dataset'); // query all the datasets
        return mapDataset(transformed, datasets);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const gene_compound_tissue_dataset_biomarker = async (args, context, info) => {
    // arguments
    let { compoundId, tissueId, compoundName, tissueName, mDataType, page = 1, per_page = 200, all = false } = args;
    // grab the ids of each data type if data type is passed in the parameters
    compoundId = compoundName ? await getIdBasedOnCompound(compoundName) : compoundId;
    tissueId = tissueName ? await getIdBasedOnTissue(tissueName) : tissueId || null;

    // check if the gene or compound id is passed?
    if (!compoundId && !tissueId) {
        throw new Error('Invalid Input! Query must include data type IDs or Names!');
    }

    try {
        const { limit, offset } = calcLimitOffset(page, per_page);

        // creates list of columns and list of subtypes for the knex query builder based on the fields requested by graphQL client
        const columns = [
            'dataset_id',
            'fdr_analytic',
            'fdr_permutation',
            'mDataType',
            'gene.id as gene_id', 
            'gene.name as gene_name', 
            'gene_seq_start', 
            'gene_seq_end', 
            'gene_annotation.symbol as symbol', 
            'gene_annotation.chr as chr'
        ];
        
        let query = knex.select(columns)
            .from('gene_compound_tissue_dataset as GD')
            .join('gene', 'gene.id', 'GD.gene_id')
            .join('gene_annotation', 'gene_annotation.gene_id', 'GD.gene_id')
            .where({ 'GD.compound_id': compoundId })
            .andWhere({ 'GD.tissue_id': tissueId })
            .andWhere({ 'GD.mDataType': mDataType });

        if (!all) query = query.limit(limit).offset(offset);

        // transform and return the data.
        const geneCompoundResults = await query;
        let transformed = transformGeneCompounds(geneCompoundResults);
        let datasets = await knex.select(['id', 'name']).from('dataset'); // query all the datasets
        return mapDataset(transformed, datasets); 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    gene_compound_dataset,
    gene_compound_tissue_dataset,
    gene_compound_dataset_biomarker,
    gene_compound_tissue_dataset_biomarker
};
