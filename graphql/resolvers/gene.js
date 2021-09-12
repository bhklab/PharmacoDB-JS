const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { transformObject } = require('../../helpers/transformObject');
const { retrieveFields } = require('../../helpers/queryHelpers');


/**
 * 
 * @param {string} gene - gene name
 * @returns {number} - gene id
 */
const getIdBasedOnGene = async (gene) => {
    const geneId = await knex.select('gene.id')
        .from('gene')
        .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id')
        .where('symbol', gene);

    // returns the gene id
    return geneId[0].id;
};

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
// TODO: Update to include chr and strand whenever the data is available.
const transformGene = data => {
    return data.map(gene => {
        const {
            id,
            name,
            symbol,
            gene_seq_start,
            gene_seq_end,
            chr,
            strand,
        } = gene;
        return {
            id: id,
            name: name,
            annotation: {
                gene_id: id,
                symbol: symbol,
                gene_seq_start: gene_seq_start,
                gene_seq_end: gene_seq_end,
                chr: chr,
                strand: strand,
            }
        };
    });
};

/**
 * Returns the transformed data for all the genes in the database.
 * @param {Object} args - Parameters for the data.
 * @param {number} [args.page = 1] - Current page number with a default value of 1.
 * @param {number} [args.per_page = 20] - Total values per page with a default value of 20.
 * @param {boolean} [args.all = false] - Boolean value whether to show all the data or not with a default value of false.
 */
const genes = async ({ page = 1, per_page = 20, all = false }, parent, info) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);

        // query to grab the genes.
        let query = knex.select().from('gene');

        // add a join to grab the gene annotations in case it's queried by the user.
        if (listOfFields.includes('annotation')) query = query.join('gene_annotation', 'gene.id', 'gene_annotation.gene_id');

        // if the user has not queried to get all the genes, 
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }

        // execute the query.
        const genes = await query
            .whereNot('name', 'like', '%AFFX%')
            .orderBy('symbol', 'desc');

        // return the transformed query.
        return transformGene(genes);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for all the queried gene in the database.
 * @param {Object} args
 */
const gene = async (args) => {
    const {
        geneId,
        geneName
    } = args;
    // throw error if neither of the arguments are passed.
    if (!geneId && !geneName) {
        throw new Error('Please specify at least one of the ID or the Name of the Gene you want to query!');
    }
    try {
        // gene query.
        let query = knex
            .select()
            .from('gene')
            .join('gene_annotation', 'gene.id', 'gene_annotation.gene_id');
        // final query based on the input args.
        let gene;
        if (geneId) {
            gene = await query.where('gene.id', geneId);
        } else if (geneName) { // using symbol column from the gene annotation table as it's being used as the gene name.
            gene = await query.where('gene_annotation.symbol', geneName);
        }
        // transforming the rowdatapacket object.
        gene = transformObject(gene);
        // getting the right data to be sent.
        const data = transformGene(gene);
        // return the first element of the list.
        return data[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    genes,
    gene,
    getIdBasedOnGene,
};
