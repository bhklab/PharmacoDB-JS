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
            gct_id, compound_id, estimate, lower, upper,
            n, tstat, fstat, pvalue, df,
            fdr, FWER_gene, FWER_compound, FWER_all, BF_p_all,
            sens_stat, mDataType, tested_in_human_trials, in_clinical_trials, compound_name, compound_uid, 
            smiles, inchikey, pubchem, fda_status, tissue_id,
            tissue_name, gene_id, gene_name, gene_seq_start, gene_seq_end,
        } = compound_compound;
        return {
            id: gct_id,
            estimate,
            lower,
            upper,
            n,
            tstat,
            fstat,
            pvalue,
            df,
            fdr,
            FWER_gene,
            FWER_compound,
            FWER_all,
            BF_p_all,
            sens_stat,
            mDataType,
            tested_in_human_trials,
            in_clinical_trials,
            gene: {
                id: gene_id,
                name: gene_name,
                annotation: {
                    gene_id,
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
        };
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
const gene_compound_tissue = async (args, context, info) => {
    // arguments
    let { geneId, geneName, compoundId, compoundName, tissueId, tissueName, page = 1, per_page = 20, all = false } = args;

    // grab the ids of each data type if data type is passed in the parameters
    geneId = geneName ? await getIdBasedOnGene(geneName) : geneId ? geneId : null;
    compoundId = compoundName ? await getIdBasedOnCompound(compoundName) : compoundId;
    tissueId = tissueName ? await getIdBasedOnTissue(tissueName) : tissueId ? tissueId : null;

    // check if the gene or compound id is passed?
    if (!geneId && !compoundId && !tissueId) throw new Error('Invalid input! Query must include geneId and compoundId and tissueId');

    try {
        const { limit, offset } = calcLimitOffset(page, per_page);
        const listOfFields = retrieveFields(info);
        // creates list of columns and list of subtypes for the knex query builder based on the fields requested by graphQL client
        const columns = [];
        const subtypes = [];

        listOfFields.forEach(el => {
            switch (el.name) {
                case 'gene':
                    columns.push(...['gene.id as gene_id', 'gene.name as gene_name', 'gene_seq_start', 'gene_seq_end']);
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
                case 'id':
                    columns.push('GD.id as gct_id');
                    break;
                default:
                    columns.push(el.name);
                    break;
            }
        });

        let query = knex.select(columns).from('gene_compound_tissue as GD');
        // chooses table to select from
        // query = geneId ? query.from('gene_compound_tissue as GD') : query.from('compound_genes as GD');
        // query = query.from('gene_compound_tissue as GD');
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
                case 'tissue':
                    query = query.join('tissue', 'tissue.id', 'GD.tissue_id');
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


module.exports = {
    gene_compound_tissue,
};
