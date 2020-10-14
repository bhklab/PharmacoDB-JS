const knex = require('../../db/knex');
const { retrieveFields } = require('../../helpers/queryHelpers');
const { calcLimitOffset } = require('../../helpers/calcLimitOffset');

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Array} - transformed array of objects.
 */
const transformCellLines = data => {
    return data.map(cell => {
        const {
            cell_id,
            cell_name,
            tissue_id,
            tissue_name
        } = cell;
        return {
            id: cell_id,
            name: cell_name,
            tissue: {
                id: tissue_id,
                name: tissue_name
            }
        };
    });
};

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Object} - transformed object.
 */
// this is not the annotation directly like compound and gene,
// but more like names in different sources.
const transformSingleCellLine = data => {
    let returnObject = {};
    const source_cell_name_list = [];
    data.forEach((row, i) => {
        const {
            cell_id,
            cell_name,
            tissue_id,
            tissue_name,
            source_cell_name,
            dataset_name
        } = row;
        // if it's the first element.
        if (!i) {
            returnObject['id'] = cell_id;
            returnObject['name'] = cell_name;
            returnObject['tissue'] = {
                id: tissue_id,
                name: tissue_name
            };
            returnObject['synonyms'] = [{
                name: source_cell_name,
                source: [dataset_name]
            }];
            if (!source_cell_name_list.includes(source_cell_name)) {
                source_cell_name_list.push(source_cell_name);
            }
        } else {
            // for all other elements.
            if (!source_cell_name_list.includes(source_cell_name)) {
                returnObject['synonyms'].push({
                    name: source_cell_name,
                    source: [dataset_name]
                });
            } else if (source_cell_name_list.includes(source_cell_name)) {
                returnObject['synonyms'].forEach((val, i) => {
                    if (val['name'] === source_cell_name) {
                        returnObject['synonyms'][i]['source'].push(dataset_name);
                    }
                });
            }
        }
    });
    return returnObject;
};

/**
 * Returns the transformed data for all the cell lines in the database.
 * @param {Object} data - Parameters for the data.
 * @param {number} [data.page = 1] - Current page number with a default value of 1.
 * @param {number} [data.per_page = 20] - Total values per page with a default value of 20.
 * @param {boolean} [data.all = false] - Boolean value whether to show all the data or not with a default value of false.
 * @param {Object} parent
 * @param {Object} info
 */
const cell_lines = async ({ page = 1, per_page = 20, all = false }, parent, info) => {
    // setting limit and offset.
    const { limit, offset } = calcLimitOffset(page, per_page);
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);
        // query to grab the cell line data.
        let query = knex.select().from('cells as c');
        // if the query containes the tissue field, then we will make a join.
        if (listOfFields.includes('tissue')) {
            query = query.join('tissues as t', 'c.tissue_id', 't.tissue_id');
        }
        // if the user has not queried to get all the compound, 
        // then limit and offset will be used to give back the queried limit.
        if (!all) {
            query.limit(limit).offset(offset);
        }
        // call to grab the cell lines.
        let cell_lines = await query;
        // return the transformed data.
        return transformCellLines(cell_lines);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * @param {Object} args - arguments passed to cell_line function.
 */
const cell_line = async args => {
    try {
        // grabbing the cell line id from the args.
        const {
            cellId,
            cellName
        } = args;
        // variable to store cell line data.
        let cell_line;
        // the base query
        let query = knex
            .select('cells.cell_id as cell_id',
                'cells.cell_name as cell_name',
                'tissues.tissue_id as tissue_id',
                'tissues.tissue_name as tissue_name',
                'source_cell_names.cell_name as source_cell_name',
                'datasets.dataset_name as dataset_name')
            .from('cells')
            .join('tissues', 'tissues.tissue_id', 'cells.tissue_id')
            .join('source_cell_names',
                'cells.cell_id',
                'source_cell_names.cell_id')
            .join('sources', 'sources.source_id', 'source_cell_names.source_id')
            .join('datasets', 'datasets.dataset_id', 'sources.dataset_id');
        // based on the arguments passed to the function.
        if (cellId) {
            cell_line = await query.where('cells.cell_id', cellId);
        } else if (cellName) {
            cell_line = await query.where('cells.cell_name', cellName);
        }
        // return the transformed data.
        return transformSingleCellLine(cell_line);
    } catch (err) {
        console.log(err);
        return err;
    }
};

module.exports = {
    cell_lines,
    cell_line
};