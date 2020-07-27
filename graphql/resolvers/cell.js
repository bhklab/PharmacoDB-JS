const knex = require('../../db/knex');

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
 */
const cell_lines = async () => {
    try {
        const cell_lines = await knex
            .select()
            .from('cells')
            .join('tissues', 'cells.tissue_id', 'tissues.tissue_id');
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
            cellId
        } = args;
        // query
        let cell_line = await knex
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
            .join('datasets', 'datasets.dataset_id', 'sources.dataset_id')
            .where('cells.cell_id', cellId);
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