const knex = require('../../db/knex');
const {
    transformObject
} = require('../../helpers/transformObject');

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
 */
// TODO: the code has to be changed in future when new database will be in place.
const genes = async () => {
    try {
        const genes = await knex.select().from('genes');
        return transformGene(genes);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for all the queried gene in the database.
 * @param {object} args
 */
// TODO: the code has to be changed in future when new database will be in place.
const gene = async args => {
    const {
        geneId
    } = args;
    try {
        let gene = await knex
            .select()
            .from('genes')
            .where('genes.gene_id', geneId);
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