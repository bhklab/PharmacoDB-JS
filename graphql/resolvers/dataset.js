const knex = require('../../db/knex');

/**
 * @returns {Object} - returns an object {cell_id: Number, cell_name: String}
 */
const datasetQuery = async () => await knex.select().from('datasets');

/**
 * @param {String} - takes an argument either 'compound', 'tissue' or 'cell'
 * @returns {Object} - return object {source: {count: Number, source: String}, ....}
 */
const countQuery = async type => {
    // return object.
    const returnObject = {};
    /**
     * queries the database to get the data in the required format.
     * number of cell lines tested across datasets
     * @returns {count: Number, source: String}
     */
    const query = await knex
        .select('source_name as source')
        .countDistinct(`${type}_id as count`)
        .from(`source_${type}_names as sn`)
        .join('sources as s', 's.source_id', 'sn.source_id')
        .groupBy('sn.source_id');
    // return object source_name: {count: Number, source: String}
    query.forEach(value => {
        const { source, count } = value;
        returnObject[source] = {
            source: source,
            count: count
        };
    });
    // return the transformed object.
    return returnObject;
};

/**
 * Returns the transformed data for all the datasets in the database.
 * @returns {Object} - {
 *      id: 'this is the id of the dataset'
 *      name: 'this is the name of the dataset'
 *      cells_tested: 'number of cell lines tested across this dataset'
 *      tissues_tested: 'number of tissues tested across this dataset'
 *      compounds_tested: ''number of compounds tested across this dataset'
 * }
 */
const datasets = async () => {
    try {
        // calling different function in order to execute the corresponding queries.
        const datasets = await datasetQuery();
        const cell_count = await countQuery('cell');
        const tissue_count = await countQuery('tissue');
        const compound_count = await countQuery('drug');

        // return the transformed data for this function.
        return datasets.map(dataset => {
            const { dataset_id, dataset_name } = dataset;
            return {
                id: dataset_id,
                name: dataset_name,
                cells_tested: cell_count[dataset_name].count,
                tissues_tested: tissue_count[dataset_name].count,
                compounds_tested: compound_count[dataset_name].count
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args - arguments for the dataset function.
 * @param {Number} args.datasetId - datasetId passed as an argument to the function.
 */

const dataset = async args => {
    try {
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    datasets,
    dataset
};
