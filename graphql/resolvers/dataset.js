const knex = require('../../knex');
const { transformObject } = require('../helpers/transformObject');
const { retrieveFields } = require('../helpers/queryHelpers');
const {createSearchRegexString} = require('../helpers/createSearchRegexString');

/**
 * @returns {Object} - all datasets query
 */
const datasetQuery = () => knex
    .select('id as dataset_id', 'name as dataset_name')
    .from('dataset');

/**
 *
 * @returns {Object}
 */
const datasetStatQuery = () => knex.select()
    .from('dataset_statistics as dt')
    .join('dataset as d', 'd.id', 'dt.dataset_id');

/**
 *
 * @returns {Object} - {
 *      CCLE: { dataset: {id: 'dataset id', name: 'dataset name'}, count: 'number of cell lines in the dataset' }
 * }
 */
const cellLinesGroupedByDatasetQuery = async () => {
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
        .distinct(`e.${type}_id`, `t.${type}_uid`, `t.name as ${type}_name`)
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
 * 
 * @returns {Object} - returns an array like this [{dataset_id: Number, dataset_name: String}]
 */
const allDatasets = async () => {
    // get the list of datasets
    const datasets = await datasetQuery();

    return transformObject(datasets);
};

/**
 * 
 * @param {string} name - a partial or full dataset name to query the result based on it 
 * @returns {Object} - dataset data matching the name based on the query string
 */
const getDatasetsBasedOnName = async (name = '') => (
    await datasetQuery()
        // .where('name', 'like', `%${name}%`)
        .where(knex.raw('?? REGEXP ?', ['name', `${createSearchRegexString(name)}`]))
);


/**
 *
 * @param {string} type - either 'cell' or 'compound' or 'tissue'
 * @param {number} datasetId - optional
 * @param {string} datasetName - optional
 * @return {Array} - returns an array of cells or compounds or tissues tested on the dataset.
 */
const getTypeDataGroupedByDataset = async (type, datasetId, datasetName) => {
    let datasets;

    const columns = ['d.id as dataset_id', 'd.name as dataset_name', `t.id as ${type}_id`, `t.name as ${type}_name`];

    if (type !== 'tissue') columns.push(`t.${type}_uid as ${type}_uid`);

    // query to get the ids and names for the type and datasets.
    const query = knex.select(columns)
        .from(`dataset_${type} as dt`)
        .join('dataset as d', 'd.id', 'dt.dataset_id')
        .join(`${type} as t`, 't.id', `dt.${type}_id`);

    // based on the param datasetId and datasetName.
    if (datasetId) {
        datasets = await query.where('dt.dataset_id', datasetId);
    } else if (datasetName) {
        datasets = await query.where('d.name', datasetName);
    } else {
        datasets = await query;
    }

    return transformObject(datasets);
};

/**
 * @param
 * @returns {Array} - return an array of Object (defined below).
 *  Object = {
 *      id: 'id of the dataset',
 *      name: 'name of the dataset',
 *      tissus_tested (grouped by datasets): 'lists of all tissues that have been tested in the datasets'
 *      cells_tested (grouped by datasets): 'lists of all cell lines that have been tested in the datasets'
 *      compounds_tested (grouped by datasets): 'lists of all compounds that have been tested in the datasets'
 *  }
 */
//TODO: Update to return only fields asked on the query
const datatypes_information_all_datasets = async () => {
    try {
        const returnData = [];
        let tissues, cells, compounds;

        const datasets = await allDatasets();
        tissues = await getTypeDataGroupedByDataset('tissue');
        cells = await getTypeDataGroupedByDataset('cell');
        compounds = await getTypeDataGroupedByDataset('compound');

        datasets.forEach(dataset => {
            const data = {};
            data['dataset'] = { id: dataset.dataset_id, name: dataset.dataset_name };
            data['tissues_tested'] = tissues.filter(d => d.dataset_id === dataset.dataset_id).map(value => ({ id: value['tissue_id'], name: value['tissue_name'] }));
            data['cells_tested'] = cells.filter(d => d.dataset_id === dataset.dataset_id).map(value => ({ id: value['cell_id'], uid: value['cell_uid'], name: value['cell_name'] }));
            data['compounds_tested'] = compounds.filter(d => d.dataset_id === dataset.dataset_id).map(value => ({ id: value['compound_id'], uid: value['compound_uid'], name: value['compound_name'] }));
            returnData.push(data);
        });

        return returnData;
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
 *      tissues_tested (data only for the datasetId): 'a list of all the tissues that have been tested in the dataset'
 *      cells_tested (data only for the datasetId): 'a list of all the cell lines that have been tested in the dataset'
 *      compounds_tested (data only for the datasetId): 'a list of all the compounds that have been tested in the dataset'
 *  }
 */
const datatypes_information_per_dataset = async (args, parent, info) => {
    // dataset id ie 1 or 2 or...
    // dataset name ie 'FIMM' ...
    const {
        datasetId,
        datasetName
    } = args;

    // throw error if neither of the arguments are passed.
    if (!datasetId && !datasetName) {
        throw new Error('Please at least specify either the ID or the Name of the dataset you want to query!');
    }

    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);

        // data returned from the graphql API.
        const returnData = [];
        let tissues, cells, compounds;
        const datasets = await allDatasets();
        const dataset = datasets.filter(dataset => { return dataset.dataset_id === datasetId || dataset.dataset_name === datasetName; })[0];
        if (listOfFields.includes('tissues_tested')) tissues = await getTypeDataGroupedByDataset('tissue', datasetId, datasetName);
        if (listOfFields.includes('cells_tested')) cells = await getTypeDataGroupedByDataset('cell', datasetId, datasetName);
        if (listOfFields.includes('compounds_tested')) compounds = await getTypeDataGroupedByDataset('compound', datasetId, datasetName);

        const data = {};
        const {
            dataset_id,
            dataset_name
        } = dataset;
        // data['id'] = dataset_id;
        // data['name'] = dataset_name;
        data['dataset'] = { id: dataset_id, name: dataset_name };

        if (listOfFields.includes('tissues_tested')) data['tissues_tested'] = tissues.map(value => ({ id: value['tissue_id'], name: value['tissue_name'] }));
        if (listOfFields.includes('cells_tested')) data['cells_tested'] = cells.map(value => ({ id: value['cell_id'], uid: value['cell_uid'], name: value['cell_name'] }));
        if (listOfFields.includes('compounds_tested')) data['compounds_tested'] = compounds.map(value => ({ id: value['compound_id'], uid: value['compound_uid'], name: value['compound_name'] }));
        
        returnData.push(data);

        return returnData;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * Returns the transformed data for all the datasets in the database.
 * @param {Object} args - args object generated by GraphQL client (not used in the function).
 * @param {Object} parent - parent object generated by GraphQL client (not used in the function).
 * @param {Object} info - info object generated by GraphQL client, contains data about requested fields.
 * @returns {Array} - return an array of dataset object. 
 * dataset {Object} - {
 *      id: 'id of the dataset'
 *      name: 'name of the dataset'
 *  }
 */
const datasets = async () => {
    try {
        // get the list of the datasets with their name and id
        const datasets = await allDatasets();
        // return the transformed data for this function.
        return datasets.map(dataset => {
            const { dataset_id, dataset_name } = dataset;
            const output = {
                id: dataset_id,
                name: dataset_name
            };
            return output;
        });
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
        throw new Error('Please at least specify either the ID or the Name of the dataset you want to query!');
    }

    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);

        // data returned from the graphql API.
        const returnData = [];
        let cell_count, compound_count, tissue_count, experiment_count, cells, compounds;

        const datasets = await allDatasets();
        const dataset = datasets.filter(dataset => { 
            return dataset.dataset_id === datasetId || dataset.dataset_name === datasetName;
        })[0];
        const stats = await datasetStatQuery();
        const stat = stats.filter(stat => stat.id === datasetId || stat.name === datasetName)[0];
        const { id, name, cell_lines, tissues, experiments } = stat;

        if (listOfFields.includes('cell_count')) cell_count = { dataset: { 'id': id, 'name': name }, count: cell_lines };
        if (listOfFields.includes('compound_tested_count')) compound_count = { dataset: { 'id': id, 'name': name }, count: stat.compounds };
        if (listOfFields.includes('tissue_tested_count')) tissue_count = { dataset: { 'id': id, 'name': name }, count: tissues };
        if (listOfFields.includes('experiment_count')) experiment_count = { dataset: { 'id': id, 'name': name }, count: experiments };
        if (listOfFields.includes('cells_tested')) cells = await summaryQuery('cell', datasetId, datasetName);
        if (listOfFields.includes('compounds_tested')) compounds = await summaryQuery('compound', datasetId, datasetName);

        const data = {};
        // returnData object.
        const {dataset_id, dataset_name} = dataset;
        data['id'] = dataset_id;
        data['name'] = dataset_name;
        if (listOfFields.includes('cell_count')) data['cell_count'] = cell_count.count;
        if (listOfFields.includes('tissue_tested_count')) data['tissue_tested_count'] = tissue_count.count;
        if (listOfFields.includes('compound_tested_count')) data['compound_tested_count'] = compound_count.count;
        if (listOfFields.includes('experiment_count')) data['experiment_count'] = experiment_count.count;

        if (listOfFields.includes('cells_tested')) data['cells_tested'] = cells.map(value => ({
            id: value['cell_id'],
            uid: value['cell_uid'],
            name: value['cell_name']
        }));
        if (listOfFields.includes('compounds_tested')) data['compounds_tested'] = compounds.map(value => ({
            id: value['compound_id'],
            uid: value['compound_uid'],
            name: value['compound_name']
        }));

        returnData.push(data);

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
    const cell_count = await cellLinesGroupedByDatasetQuery();
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
const type_tested_on_dataset = async ({ type: dataType, datasetId }) => {
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
 * @param {String} - takes an argument either 'compound', 'tissue' or 'cell'
 * @returns {Object} - return object {source: {count: Number, source: String}, ....}
 */
const typeCountGroupByDataset = async ({ type: type }) => {
    // return object.
    const returnObject = [];

    /**
     * queries the database to get the data in the required format.
     * number of give type total across datasets
     * @returns {count: Number, source: String}
     */
    const query = await knex
        .select('d.name as dataset_name', 'd.id as dataset_id')
        .count(`${type}_id as count`)
        .from(`dataset_${type} as dt`)
        .join('dataset as d', 'd.id', 'dt.dataset_id')
        .groupBy('dt.dataset_id');
        
    query.forEach(value => {
        const {
            dataset_id, dataset_name, count } = value;
        returnObject.push({
            dataset: { 'id': dataset_id, 'name': dataset_name },
            count
        });
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
    return stats.map(({id, name, cell_lines, compounds, tissues, experiments })  =>
        ({
            dataset: { 'id': id, 'name': name },
            cell_line_count: cell_lines,
            tissue_count: tissues,
            compound_count: compounds,
            experiment_count: experiments
        }));
};

module.exports = {
    datasets,
    dataset,
    getDatasetsBasedOnName,
    cell_lines_grouped_by_dataset,
    type_tested_on_dataset,
    typeCountGroupByDataset,
    datatypes_information_all_datasets,
    datatypes_information_per_dataset,
    dataset_stats,
};
