const knex = require('../../db/knex');
const { retrieveFields } = require('../helpers/queryHelpers');
const { calcLimitOffset } = require('../helpers/calcLimitOffset');

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Array} - transformed array of objects.
 */
const transformCellLines = data => {
    // object to store the final result.
    const finalData = {};

    // preparing the transformed data.
    data.forEach(cell => {
        const {
            cell_id,
            cell_uid,
            cell_name,
            tissue_id,
            tissue_name,
            dataset_id,
            dataset_name,
        } = cell;

        if (finalData[cell_id]) {
            const isPresent = finalData[cell_id]['dataset'].filter(el => el.name === dataset_name);
            if (isPresent.length === 0) {
                finalData[cell_id]['dataset'].push({
                    id: dataset_id,
                    name: dataset_name,
                });
            }
        } else {
            finalData[cell_id] = {
                id: cell_id,
                cell_uid: cell_uid,
                name: cell_name,
                tissue: {
                    id: tissue_id,
                    name: tissue_name,
                },
                dataset: [{
                    id: dataset_id,
                    name: dataset_name,
                }]
            };
        }
    });

    // return the final data.
    return Object.values(finalData);
};

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Object} - transformed object.
 */
// this is not the annotation directly like compound and gene,
// but more like names in different sources.
const transformSingleCellLine = (data) => {
    let returnObject = {};
    const source_cell_name_list = [];
    data.forEach((row, i) => {
        const {
            cell_id,
            cell_uid,
            cell_name,
            tissue_id,
            tissue_name,
            source_cell_name,
            dataset_id,
            dataset_name,
            diseases,
            accessions
        } = row;
        // if it's the first element.
        if (!i) {
            returnObject['id'] = cell_id;
            returnObject['cell_uid'] = cell_uid;
            returnObject['name'] = cell_name;
            returnObject['diseases'] = diseases ? diseases.split('|||') : diseases;
            returnObject['accessions'] = accessions;
            returnObject['tissue'] = {
                id: tissue_id,
                name: tissue_name
            };
            returnObject['synonyms'] = source_cell_name ? [{
                name: source_cell_name,
                source: [{ 'id': dataset_id, 'name': dataset_name }]
            }] : [];
            source_cell_name_list.push(source_cell_name);
        } else {
            // for all other elements.
            if (!source_cell_name_list.includes(source_cell_name)) {
                returnObject['synonyms'].push({
                    name: source_cell_name,
                    source: [{ 'id': dataset_id, 'name': dataset_name }]
                });
                source_cell_name_list.push(source_cell_name);
            } else if (source_cell_name_list.includes(source_cell_name)) {
                returnObject['synonyms'].forEach((val, i) => {
                    if (val['name'] === source_cell_name) {
                        if (!returnObject['synonyms'][i]['source'].filter(source => source.id === dataset_id).length > 0)
                            returnObject['synonyms'][i]['source'].push({ 'id': dataset_id, 'name': dataset_name });
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

        const selectFields = ['c.id as cell_id', 'c.cell_uid as cell_uid', 'c.name as cell_name', 'tissue_id'];
        // adds tissue name to the list of knex columns to select.
        if (listOfFields.includes('tissue')) selectFields.push('t.name as tissue_name');
        // add dataset detail to the list of knex columns to select.
        if (listOfFields.includes('dataset')) selectFields.push('d.name as dataset_name', 'd.id as dataset_id');

        // query to grab the cell line data.
        let query = knex.select(...selectFields).from('cell as c');
        // if the query containes the tissue field, then we will make a join.
        if (listOfFields.includes('tissue')) query = query.join('tissue as t', 'c.tissue_id', 't.id');
        // if the query contains the dataset field, then make a join.
        if (listOfFields.includes('dataset')) query = query.join('dataset_cell as dc', 'dc.cell_id', 'c.id')
            .join('dataset as d', 'dc.dataset_id', 'd.id').orderBy('d.id');

        // if the user has not queried to get all the compound,
        // then limit and offset will be used to give back the queried limit.
        if (!all) query.limit(limit).offset(offset);
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
            cellName,
            cellUID
        } = args;
        // throw error if neither of the arguments are passed.
        if (!cellUID && !cellId && !cellName) {
            throw new Error('Please specify either the ID or the Name of the cell line you want to query!');
        }
        // variable to store cell line data.
        let cell_line;
        // the base query
        let query = knex
            .select('cell.id as cell_id',
                'cell.cell_uid as cell_uid',
                'cell.name as cell_name',
                'tissue.id as tissue_id',
                'tissue.name as tissue_name',
                'cell_synonym.cell_name as source_cell_name',
                'dataset.id as dataset_id',
                'dataset.name as dataset_name',
                'cellosaurus.di as diseases',
                'cellosaurus.accession as accessions')
            .from('cell')
            .join('tissue', 'tissue.id', 'cell.tissue_id')
            .join('cell_synonym', 'cell.id', 'cell_synonym.cell_id')
            .join('dataset', 'dataset.id', 'cell_synonym.dataset_id')
            .join('cellosaurus', 'cellosaurus.cell_id', 'cell.id');
        // based on the arguments passed to the function.
        if (cellUID) {
            cell_line = await query.where('cell.cell_uid', cellUID);
        } else if (cellId) {
            cell_line = await query.where('cell.id', cellId);
        } else if (cellName) {
            cell_line = await query.where('cell.name', cellName);
        }

        // If the full query does not return any results, query the minimum information that needs to be returned.
        // if(cell_line.length === 0){
        //     query = knex
        //         .select('cell.id as cell_id',
        //             'cell.cell_uid as cell_uid',
        //             'cell.name as cell_name',
        //             'tissue.id as tissue_id',
        //             'tissue.name as tissue_name',
        //             'dataset.id as dataset_id',
        //             'dataset.name as dataset_name',
        //             'cellosaurus.di as diseases',
        //             'cellosaurus.accession as accessions')
        //         .from('cell')
        //         .join('tissue', 'tissue.id', 'cell.tissue_id')
        //         .join('dataset_cell', 'dataset_cell.cell_id', 'cell.id')
        //         .join('dataset', 'dataset.id', 'dataset_cell.dataset_id')
        //         .join('cellosaurus', 'cellosaurus.cell_id', 'cell.id');
        // }
        // if (cellUID) {
        //     cell_line = await query.where('cell.cell_uid', cellUID);
        // }else if (cellId) {
        //     cell_line = await query.where('cell.id', cellId);
        // } else if (cellName) {
        //     cell_line = await query.where('cell.name', cellName);
        // }

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
