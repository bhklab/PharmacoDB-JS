const knex = require('../../db/knex');

/**
 * @return {Object} - returns an object {cell_id: Number, cell_name: String}
 */
const datasetQuery = async () => await knex.select().from('datasets');

/**
 * @returns {Object} - return object {source_name: {cell_count: Number, source_name: String}, ....}
 */
const cellCountQuery = async () => {
    // return object.
    const returnObject = {};
    // query the database to get the data in the required format.
    // number of cell lines tested across datasets
    // @return {cell_count: Number, source_name: String}
    const query = await knex
        .select('source_name')
        .countDistinct('cell_id as cell_count')
        .from('source_cell_names as sc')
        .join('sources as s', 's.source_id', 'sc.source_id')
        .groupBy('sc.source_id');
    // return object source_name: {cell_count: Number, source_name: String}
    query.forEach(value => {
        const { source_name: source, cell_count: count } = value;
        returnObject[source] = {
            source_name: source,
            cell_count: count
        };
    });
    // return the transformed object.
    return returnObject;
};

/**
 * Returns the transformed data for all the datasets in the database.
 */
const datasets = async () => {
    try {
        // calling different function in order to execute the corresponding queries.
        const datasets = await datasetQuery();
        const cell_count = await cellCountQuery();

        // return the transformed data for this function.
        return datasets.map(dataset => {
            const { dataset_id, dataset_name } = dataset;
            return {
                id: dataset_id,
                name: dataset_name,
                tested_cells: cell_count[dataset_name]['cell_count']
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
