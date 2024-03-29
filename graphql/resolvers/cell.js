const knex = require('../../knex');
const { retrieveFields } = require('../helpers/queryHelpers');
const {validatePageAndPerPageParameters} = require('../helpers/validatePageAndPerPageParameters');
const {findElement} = require('../helpers/findElement');
const {calculateRange} = require('../helpers/calculateRange');
const {createSearchRegexString} = require('../helpers/createSearchRegexString');

/**
 * 
 * @returns {Object} - all the cell lines
 */
const cellLineQuery = () => knex.select().from('cell');

/**
 * 
 * @param {Object} cell - cell line object
 * @returns {Object} - creates a transformed object for the cell line data
 */
const allCellLinesObject = function (cell) {
    const {
        cell_id, cell_uid, cell_name,
        tissue_id, tissue_name, dataset_id, dataset_name,
    } = cell;
    // return the data object
    return {
        id: cell_id,
        uid: cell_uid,
        name: cell_name,
        tissue: {
            id: tissue_id,
            name: tissue_name,
        },
        datasets: [{
            id: dataset_id,
            name: dataset_name,
        }]
    };
};


/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Array} - transformed array of objects.
 */
const transformAllCellLinesData = data => {
    // object to store the final result.
    const finalData = {};

    // preparing the transformed data.
    data.forEach(cell => {
        const { cell_id, dataset_id, dataset_name } = cell;

        if (finalData[cell_id]) {
            // checks if the dataset is already present or not.
            // const isDatasetPresent = finalData[cell_id]['datasets'].find(el => el.name === dataset_name);
            const isDatasetPresent = findElement(finalData[cell_id]['datasets'], dataset_name,'name');

            // add to the object if the dataset is not already present
            if (!isDatasetPresent) {
                finalData[cell_id]['datasets'].push({
                    id: dataset_id,
                    name: dataset_name,
                });
            }
        } else {
            finalData[cell_id] = allCellLinesObject(cell);
        }
    });

    // return the final data.
    return Object.values(finalData);
};

/**
 * creates a synonym object
 * @param {string} cell 
 * @param {number} dataset_id 
 * @param {string} dataset_name 
 * @returns {object}
 */
const createSynonymObject = (cell, dataset_id, dataset_name) => (
    {
        name: cell,
        dataset: [{ 'id': dataset_id, 'name': dataset_name }]
    }
);

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Object} - transformed object.
 */
// this is not the annotation directly like compound and gene,
// but more like names in different synonyms.
const transformSingleCellLine = (data) => {
    let returnObject = {};
    const cell_synonyms = [];

    data.forEach((row, i) => {
        const {
            cell_id, cell_uid, cell_name,
            tissue_id, tissue_name, synonym_cell_name,
            dataset_id, dataset_name, diseases, accession_id
        } = row;
        
        // if it's the first element.
        if (!i) {
            returnObject['id'] = cell_id;
            returnObject['uid'] = cell_uid;
            returnObject['name'] = cell_name;
            returnObject['diseases'] = diseases ? diseases.split('|||') : diseases;
            returnObject['accession_id'] = accession_id;
            returnObject['tissue'] = {
                id: tissue_id,
                name: tissue_name
            };
            returnObject['synonyms'] = synonym_cell_name 
                ? [createSynonymObject(synonym_cell_name, dataset_id, dataset_name)] 
                : [];
            cell_synonyms.push(synonym_cell_name);
        } else {
            // for all other elements.
            if (!cell_synonyms.includes(synonym_cell_name)) {
                returnObject['synonyms'].push(createSynonymObject(synonym_cell_name, dataset_id, dataset_name));
                cell_synonyms.push(synonym_cell_name);
            } else if (cell_synonyms.includes(synonym_cell_name)) {
                returnObject['synonyms'].forEach((val, i) => {
                    if (val['name'] === synonym_cell_name) {
                        if (!returnObject['synonyms'][i]['dataset'].filter(synonym => synonym.id === dataset_id).length > 0)
                            returnObject['synonyms'][i]['dataset'].push({ 'id': dataset_id, 'name': dataset_name });
                    }
                });
            }
        }
    });
    return returnObject;
};

/**
 * 
 * @param {string} name - partial/complete cell name
 * @returns {Array} - cell line data related to input cell name
 */
const getCellLinesBasedOnName = async (name) => (
    await cellLineQuery()
        // .where('name', 'like', `%${name}%`)
        .where(knex.raw('?? REGEXP ?', ['name', `${createSearchRegexString(name)}`]))
);


/**
 * ----------------------------------------------------------------
 * All Cell Lines Resolver Function
 * ----------------------------------------------------------------
 */
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
    const {pageNumber, perPageCount} = validatePageAndPerPageParameters(page, per_page);

    // setting limit and offset.
    // const { limit, offset } = calcLimitOffset(pageNumber, perPageCount);
    const {lowerBound, upperBound} = calculateRange(pageNumber, perPageCount);
    
    try {
        // extracts list of fields requested by the client
        const listOfFields = retrieveFields(info).map(el => el.name);

        const selectFields = ['c.id as cell_id', 'c.cell_uid as cell_uid', 'c.name as cell_name', 'tissue_id'];
        // adds tissue name to the list of knex columns to select.
        if (listOfFields.includes('tissue')) selectFields.push('t.name as tissue_name');
        // add dataset detail to the list of knex columns to select.
        if (listOfFields.includes('datasets')) selectFields.push('d.name as dataset_name', 'd.id as dataset_id');

        // query to grab the cell line data.
        let query = knex.select(...selectFields).from('cell as c');
        // if the query containes the tissue field, then we will make a join.
        if (listOfFields.includes('tissue')) query = query.join('tissue as t', 'c.tissue_id', 't.id');
        // if the query contains the dataset field, then make a join.
        if (listOfFields.includes('datasets')) {
            query = query.join('dataset_cell as dc', 'dc.cell_id', 'c.id')
                .join('dataset as d', 'dc.dataset_id', 'd.id');
        }

        // if the user has not queried to get all the compound,
        // then upperbound and lowerbound variables are used to get the correct data.
        if (!all) {
            query
                .whereBetween('cell_id', [lowerBound, upperBound])
                .orderBy('cell_id');
        }

        // call to grab the cell lines.
        let cell_lines = await query;

        // return the transformed data.
        return transformAllCellLinesData(cell_lines);
    } catch (err) {
        console.log(err);
        throw err;
    }
};


/**
 * ----------------------------------------------------------------
 * Single Cell Line Resolver Function
 * ----------------------------------------------------------------
 */
/**
 * @param {Object} args - arguments passed to cell_line function.
 */
const cell_line = async args => {
    try {
        // grabbing the cell line id from the args.
        const { cellId, cellName, cellUID } = args;

        // throw error if neither of the arguments are passed.
        if (!cellUID && !cellId && !cellName) {
            throw new Error('Please specify either the ID or the Name of the cell line you want to query.');
        }

        // check if the cell line is in the database?
        let cellLineId;
        if (cellUID) {
            cellLineId = await knex.select('cell.id').from('cell').where('cell.cell_uid', cellUID);
        } else if (cellId) {
            cellLineId = await knex.select('cell.id').from('cell').where('cell.id', cellId);
        } else if (cellName) {
            cellLineId = await knex.select('cell.id').from('cell').where('cell.name', cellName);
        }

        // if the cell line is not present in the database return with the error
        if (cellLineId.length === 0) {
            return Error('Please provide a valid cell ID, Name or UID.');
        } else {
            // the base query
            let queryData = await knex
                .select('cell.id as cell_id',
                    'cell.cell_uid as cell_uid',
                    'cell.name as cell_name',
                    'tissue.id as tissue_id',
                    'tissue.name as tissue_name',
                    'cell_synonym.cell_name as synonym_cell_name',
                    'dataset.id as dataset_id',
                    'dataset.name as dataset_name',
                    'cellosaurus.di as diseases',
                    'cellosaurus.accession as accession_id')
                .from('cell')
                .join('tissue', 'tissue.id', 'cell.tissue_id')
                .join('cell_synonym', 'cell.id', 'cell_synonym.cell_id')
                .join('dataset', 'dataset.id', 'cell_synonym.dataset_id')
                .join('cellosaurus', 'cellosaurus.cell_id', 'cell.id')
                .where('cell.id', cellLineId[0].id);

            // return the transformed data.
            return transformSingleCellLine(queryData);
        }
    } catch (err) {
        console.log(err);
        throw Error(`An Error Occured with Error-Code: ${err.code}; Error-Message: ${err.sqlMessage}`);
    }
};

module.exports = {
    cell_lines,
    cell_line,
    getCellLinesBasedOnName,
};
