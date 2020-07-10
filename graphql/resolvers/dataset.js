const knex = require('../../db/knex');
const {
    transformObject
} = require('../../helpers/transformObject');

/**
 * @param {Number} - datasetId (optional)
 * @returns {Object} - returns an array like this [{dataset_id: Number, dataset_name: String}]
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
const experiementsGroupByDatasetQuery = async () => {
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
        const {
            source,
            count
        } = value;
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
     * number of give type total across datasets
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
        const {
            source,
            count
        } = value;
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
 * @returns {Array} - return an array of dataset object.
 * dataset {Object} -
 *  {
 *      id: 'id of the dataset'
 *      name: 'name of the dataset'
 *  }
 */
const datasets = async () => {
    try {
        // grab the datasets {id, name}.
        const datasets = await datasetQuery();
        // return the transformed data for this function.
        const data = datasets.map(dataset => {
            const {
                dataset_id,
                dataset_name
            } = dataset;
            return {
                id: dataset_id,
                name: dataset_name
            };
        });
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args - arguments for the dataset function.
 * @param {Number} args.datasetId - datasetId passed as an argument to the function.
 * @returns {Array} - return an array of Object (defined below).
 *  Object = {
 *      id: 'id of the dataset',
 *      name: 'name of the dataset',
 *      cell_count: 'number of cell lines across the dataset'
 *      tissue_count: 'number of tissues across the dataset'
 *      compound_count: 'number of compounds across the dataset'
 *      experiment_count: 'number of experiments held accross the dataset'
 *      cells_tested (data only for the datasetId): 'a list of all the cell lines that have been tested in the dataset'
 *      compounds_tested (data only for the datasetId): 'a list of all the compounds that have been tested in the dataset'
 *  }
 */
const dataset = async args => {
    // dataset id ie 1 or 2 or...
    const {
        datasetId
    } = args;
    try {
        // data returned from the graphql API.
        const returnData = [];
        const datasets = await datasetQuery();
        const cell_count = await countQuery('cell');
        const tissue_count = await countQuery('tissue');
        const compound_count = await countQuery('drug');
        const experiment_count = await experiementsGroupByDatasetQuery();
        const cells = await summaryQuery('cell', datasetId);
        const compounds = await summaryQuery('drug', datasetId);

        datasets.forEach(dataset => {
            // destructuring the dataset object.
            const {
                dataset_id,
                dataset_name
            } = dataset;
            // data object.
            const data = {};

            data['id'] = dataset_id;
            data['name'] = dataset_name;
            data['cells'] = cell_count[dataset_name].count;
            data['tissues'] = tissue_count[dataset_name].count;
            data['compounds'] = compound_count[dataset_name].count;
            data['experiments'] = experiment_count[dataset_name].count;

            if (dataset_id === datasetId) {
                data['cells_tested'] = cells;
                data['compounds_tested'] = compounds;

                returnData.unshift(data);
            } else {
                returnData.push(data);
            }
        });
        return returnData;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    datasets,
    dataset
};