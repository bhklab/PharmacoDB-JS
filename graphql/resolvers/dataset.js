const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');

/**
 * @returns {Object} - returns an array like this [{cell_id: Number, cell_name: String}]
 */
const datasetQuery = async datasetId => {
    const dataset = await knex
        .select('dataset_id', 'dataset_name')
        .from('datasets')
        .where('dataset_id', 'like', datasetId ? `${datasetId}` : '%%');
    return transformObject(dataset);
};

/**
 *  @returns {Object} - return object {source: {count: Number, source: String}, ....}
 */
const countExperimentsQuery = async () => {
    // return object.
    const returnObject = {};
    const query = await knex
        .select('d.dataset_name as source')
        .countDistinct('e.experiment_id as count')
        .from('experiments as e')
        .join('datasets as d', 'd.dataset_id', 'e.dataset_id')
        .groupBy('d.dataset_id');
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
 *
 * @param {String} type - either 'cell' or 'compound'
 * @param {Number} datasetId
 */
const summaryQuery = async (type, datasetId) => {
    // query to get the id and name for the type.
    const query = await knex
        .distinct(`e.${type}_id`, `t.${type}_name`)
        .from('experiments as e')
        .join(`${type}s as t`, `t.${type}_id`, `e.${type}_id`)
        .where('e.dataset_id', datasetId);
    return query.map(value => value[`${type}_name`]);
};

/**
 * Returns the transformed data for all the datasets in the database.
 * @returns {Object} - {
 *      id: 'this is the id of the dataset'
 *      name: 'this is the name of the dataset'
 *      cells_tested: 'number of cell lines tested across the dataset'
 *      tissues_tested: 'number of tissues tested across the dataset'
 *      compounds_tested: 'number of compounds tested across the dataset'
 *      experiments: 'number of experiments held accross the dataset'
 * }
 */
const datasets = async () => {
    try {
        // calling different function in order to execute the corresponding queries.
        const datasets = await datasetQuery();
        const cell_count = await countQuery('cell');
        const tissue_count = await countQuery('tissue');
        const compound_count = await countQuery('drug');
        const experiment_count = await countExperimentsQuery();

        // return the transformed data for this function.
        return datasets.map(dataset => {
            const { dataset_id, dataset_name } = dataset;
            return {
                id: dataset_id,
                name: dataset_name,
                cells: cell_count[dataset_name].count,
                tissues: tissue_count[dataset_name].count,
                compounds: compound_count[dataset_name].count,
                experiments: experiment_count[dataset_name].count
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
 * @returns {Object} - {
 *      id: 'id of the dataset',
 *      name: 'name of the dataset',
 *      cells_tested: 'a list of all the cell lines that have been tested in the dataset'
 *      compounds_tested: 'a list of all the compounds that have been tested in the dataset'
 * }
 */
const dataset = async args => {
    const { datasetId } = args;
    try {
        const dataset = await datasetQuery(datasetId);
        const cells = await summaryQuery('cell', datasetId);
        const compounds = await summaryQuery('drug', datasetId);
        return {
            id: dataset[0]['dataset_id'],
            name: dataset[0]['dataset_name'],
            cells_tested: cells,
            compounds_tested: compounds
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    datasets,
    dataset
};
