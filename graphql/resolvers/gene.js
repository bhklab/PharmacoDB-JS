const knex = require('../../db/knex');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');
const { transformObject } = require('../../helpers/transformObject');

/**
 * @param {Array} data
 * @returns {Array} - Returns a transformed array of objects.
 */
const transformGene = data => {
    return data.map(gene => {
        const {
            gene_id,
            gene_name,
            ensg,
            gene_seq_start,
            gene_seq_end
        } = gene;
        return {
            id: gene_id,
            name: gene_name,
            annotation: {
                gene_id: gene_id,
                ensg: ensg,
                gene_seq_start: gene_seq_start,
                gene_seq_end: gene_seq_end
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
// TODO: the code has to be changed in future when new database will be in place.
// TODO: right now a single table genes is used which has been split into two new tables ie gene and gene_annotation.
const genes = async ({ page = 1, per_page = 20, all = false }) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        let query = knex.select().from('genes');
        // if the user has not queried to get all the compound, 
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }
        // execute the query.
        const genes = await query;
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
// TODO: the code has to be changed in future when new database will be in place.
// TODO: right now a single table genes is used which has been split into two new tables ie gene and gene_annotation.
const gene = async (args) => {
    const {
        geneId,
        geneName
    } = args;
    // throw error if neither of the arguments are passed.
    if (!geneId && !geneName) {
        throw new Error('Please specify atleast one of the ID or the Name of the Gene you want to query!');
    }
    try {
        let query = knex
            .select()
            .from('genes');
        // final query based on the input args.
        let gene;
        if (geneId) {
            gene = await query.where('genes.gene_id', geneId);
        } else if (geneName) {
            gene = await query.where('genes.gene_name', geneName);
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
    gene
};