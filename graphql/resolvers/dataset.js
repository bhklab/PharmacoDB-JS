const knex = require('../../db/knex');
const { transformObject } = require('../../helpers/transformObject');
const { retrieveFields } = require('../../helpers/queryHelpers');


/**
 * @param {number} - datasetId (optional)
 * @returns {Object} - returns an array like this [{dataset_id: Number, dataset_name: String}]
 */
const datasetQuery = async datasetId => {
    const dataset = await knex
        .select('id as dataset_id', 'name as dataset_name')
        .from('dataset')
        .where('id', 'like', datasetId ? `${datasetId}` : '%%');
    return transformObject(dataset);
};

/**
 * 
 * @returns {Object} - {
 *      CCLE: { dataset: {id: 'dataset id', name: 'dataset name'}, count: 'number of cell lines in the dataset' }
 * }
 */
const cellLinesGroupByDatasetQuery = async () => {
    // return object.
    const returnObject = {};
    const dataset = [];
    const query = await knex
        .select('d.id as dataset_id', 'd.name as dataset_name', 'c.id as cell_id', 'c.name as cell_name', 'tissue_id')
        .from('dataset_cell as dc')
        .leftJoin('dataset as d', 'd.id', 'dc.dataset_id')
        .leftJoin('cell as c', 'c.id', 'dc.cell_id');
    // return object {dataset: {id: Number, name: String}, count: number of cells in the dataset}.
    query.forEach(value => {
        const {
            dataset_name,
            dataset_id,
            cell_id,
            cell_name
        } = value;
        if (!dataset.includes(dataset_name)) {
            dataset.push(dataset_name);
            returnObject[dataset_name] = {
                dataset: {
                    id: dataset_id,
                    name: dataset_name,
                },
                count: 1,
                type: 'cell_line',
                list: [{
                    id: cell_id,
                    name: cell_name
                }]
            };
        } else {
            returnObject[dataset_name].count += 1;
            returnObject[dataset_name].list.push({
                id: cell_id,
                name: cell_name
            });
        }
    });
    // return the transformed object.
    return returnObject;
};


/**
 *  @param {string} - string for which we want to get the count, eg experiment, tissue etc.
 *  @returns {Object} - return object {{dataset: {id: 'dataset id', name: 'dataset name'}, count: Number}, ....}
 */
const typeTestedCountGroupByDatasetQuery = async (type) => {
    // return object.
    const returnObject = {};
    // sets mysql expression for distinct count query
    const countExpression = type === 'experiment' ? 'e.id as count' : `e.${type}_id as count`;
    const query = await knex
        .select('d.name as dataset_name', 'd.id as dataset_id')
        .countDistinct(countExpression)
        .from('experiment as e')
        .join('dataset as d', 'd.id', 'e.dataset_id')
        .groupBy('d.id');
    // return object {dataset: {id: Number, name: String}, count: number of 'types' tested in the dataset}.
    query.forEach(value => {
        const {
            dataset_name,
            dataset_id,
            count
        } = value;
        returnObject[dataset_name] = {
            dataset: {
                id: dataset_id,
                name: dataset_name
            },
            count: count
        };
    });
    // return the transformed object.
    return returnObject;
};


/**
 *
 * @param {string} type - either 'cell' or 'compound'
 * @param {number} datasetId
 * @param {string} datasetName
 * @return {Array} - returns an array of cells tested or compounds tested on the dataset.
 */
const summaryQuery = async (type, datasetId, datasetName) => {
    let datasets;
    // query to get the id and name for the type.
    const query = knex
        .select('d.name as dataset_name', 'd.id as dataset_id')
        .distinct(`e.${type}_id`, `t.name as ${type}_name`)
        .from('experiment as e')
        .join('dataset as d', 'd.id', 'e.dataset_id')
        .join(`${type} as t`, 't.id', `e.${type}_id`);
    // based on the param datasetId and datasetName.
    if (datasetId) {
        datasets = await query.where('e.dataset_id', datasetId);
    } else if (datasetName) {
        datasets = await query.where('d.name', datasetName);
    }
    return transformObject(datasets);
};


/**
 * Returns the transformed data for all the datasets in the database.
 * @param {Object} args - args object generated by GraphQL client (not used in the function).
 * @param {Object} parent - parent object generated by GraphQL client (not used in the function).
 * @param {Object} info - info object generated by GraphQL client, contains data about requested fields.
 * @returns {Array} - return an array of dataset object.
 * dataset {Object} -
 *  {
 *      id: 'id of the dataset'
 *      name: 'name of the dataset'
 *  }
 */
const datasets = async (args, parent, info) => {
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);
        // grab the datasets {id, name}.
        const datasets = await datasetQuery();
        // retrieves data if it was requested
        let compound_count, cell_count, experiment_count, tissue_count;
        if (listOfFields.includes('compound_tested_count')) compound_count = await typeTestedCountGroupByDatasetQuery('compound');
        if (listOfFields.includes('cell_count')) cell_count = await cellLinesGroupByDatasetQuery();
        if (listOfFields.includes('experiment_count')) experiment_count = await typeTestedCountGroupByDatasetQuery('experiment');
        if (listOfFields.includes('tissue_tested_count')) tissue_count = await typeTestedCountGroupByDatasetQuery('tissue');

        console.log(tissue_count);
        
        // return the transformed data for this function.
        const data = datasets.map(dataset => {
            const {
                dataset_id,
                dataset_name
            } = dataset;
            const output = {
                id: dataset_id,
                name: dataset_name
            };
            // adds extra data fields if requested by client
            if (listOfFields.includes('compound_tested_count')) output.compound_tested_count = compound_count[dataset_name].count;
            if (listOfFields.includes('cell_count')) output.cell_count = cell_count[dataset_name].count;
            if (listOfFields.includes('experiment_count')) output.experiment_count = experiment_count[dataset_name].count;
            if (listOfFields.includes('tissue_tested_count')) output.tissue_tested_count = tissue_count[dataset_name].count;
            return output;
        });
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


/**
 * @param {Object} args - arguments for the dataset function.
 * @param {number} args.datasetId - datasetId passed as an argument to the function.
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
const dataset = async (args, parent, info) => {
    // dataset id ie 1 or 2 or...
    // dataset name ie 'FIMM' ...
    const {
        datasetId,
        datasetName
    } = args;
    // throw error if neither of the arguments are passed.
    if (!datasetId && !datasetName) {
        throw new Error('Please aleast specify either the ID or the Name of the dataset you want to query!');
    }
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);
        // data returned from the graphql API.
        const returnData = [];
        let cell_count, compound_count, tissue_count, experiment_count, cells, compounds;
        const datasets = await datasetQuery();
        if (listOfFields.includes('cell_count')) cell_count = await cellLinesGroupByDatasetQuery();
        if (listOfFields.includes('compound_tested_count')) compound_count = await typeTestedCountGroupByDatasetQuery('compound');
        if (listOfFields.includes('tissue_tested_count')) tissue_count = await typeTestedCountGroupByDatasetQuery('tissue');
        if (listOfFields.includes('experiment_count')) experiment_count = await typeTestedCountGroupByDatasetQuery('experiment');
        if (listOfFields.includes('cells_tested')) cells = await summaryQuery('cell', datasetId, datasetName);
        if (listOfFields.includes('compounds_tested')) compounds = await summaryQuery('compound', datasetId, datasetName);

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
            if (listOfFields.includes('cell_count')) data['cell_count'] = cell_count[dataset_name].count;
            if (listOfFields.includes('tissue_tested_count')) data['tissue_tested_count'] = tissue_count[dataset_name].count;
            if (listOfFields.includes('compound_tested_count')) data['compound_tested_count'] = compound_count[dataset_name].count;
            if (listOfFields.includes('experiment_count')) data['experiment_count'] = experiment_count[dataset_name].count;

            if (dataset_id === datasetId || dataset_name === datasetName) {
                if (listOfFields.includes('cells_tested')) data['cells_tested'] = cells.map(value => value['cell_name']);
                if (listOfFields.includes('compounds_tested')) data['compounds_tested'] = compounds.map(value => value['compound_name']);

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


/**
 * cell lines grouped by the dataset.
 * @returns {Array} - returns an array of the objects.
 * { dataset: {id: 'dataset id', name: 'dataset name'}, count: 'number of cell lines in the dataset' }
 */
// TODO: Probably later on this can be changed type_grouped_by_dataset.
const cell_lines_grouped_by_dataset = async () => {
    const cell_count = await cellLinesGroupByDatasetQuery();
    return Object.keys(cell_count).map(value => cell_count[value]);
};


/**
 * @param {Object} - Args {type: 'it can be compound, tissue, cells', datasetId: 'dataset id'}
 * @returns {Array} - returns an array of the objects. 
 * { 
 *      dataset: {id: 'dataset id', name: 'dataset name'}, 
 *      type: 'example compound', 
 *      list: {id: 'type id', name: 'type name' } 
 * }
 */
const type_tested_on_dataset_summary = async ({ type: dataType, datasetId }) => {
    const type = dataType.toLowerCase();
    const type_list = await summaryQuery(type, datasetId);
    const count = type_list.length;
    const returnObject = {};
    type_list.forEach((value, i) => {
        const { dataset_name, dataset_id } = value;
        if (!i) {
            returnObject['dataset'] = {
                id: dataset_id,
                name: dataset_name
            };
            returnObject['type'] = type;
            returnObject['count'] = count;
            returnObject['list'] = [];
        }
        returnObject['list'].push({
            id: value[`${type}_id`],
            name: value[`${type}_name`]
        });
    });
    return returnObject;
};

/**
 * 
 * @returns {Object}
 */
// TODO: Using dataset_id right now, might have to change in future.
const datasetStatQuery = () => {
    return knex.select()
        .from('dataset_statistics as dt')
        .join('dataset as d', 'd.id', 'dt.dataset_id');
};


/**
 * @param {String} - takes an argument either 'compound', 'tissue' or 'cell'
 * @returns {Object} - return object {source: {count: Number, source: String}, ....}
 */
const typeCountGroupByDataset = async type => {
    // return object.
    const returnObject = {};
    /**
     * queries the database to get the data in the required format.
     * number of give type total across datasets
     * @returns {count: Number, source: String}
     */
    const query = await knex
        .select('d.name as dataset')
        .countDistinct(`${type}_id as count`)
        .from(`dataset_${type} as dt`)
        .join('dataset as d', 'd.id', 'dt.dataset_id')
        .groupBy('dt.dataset_id');
    query.forEach(value => {
        const {
            dataset,
            count
        } = value;
        returnObject[dataset] = {
            dataset,
            count
        };
    });
    // return the transformed object.
    return returnObject;
};

/**
 * @returns {Object}
 */
// NOTE: This table stores the static data type count.
const dataset_stats = async () => {
    const stats = await datasetStatQuery();
    // return object.
    return stats.map(stat => {
        const { id, name, cell_lines, compounds, tissues, experiments } = stat;
        return {
            id,
            name,
            cell_line_count: cell_lines,
            tissue_count: tissues,
            compound_count: compounds,
            experiment_count: experiments
        };
    });
};



module.exports = {
    datasets,
    dataset,
    cell_lines_grouped_by_dataset,
    type_tested_on_dataset_summary,
    typeCountGroupByDataset,
    dataset_stats
};
