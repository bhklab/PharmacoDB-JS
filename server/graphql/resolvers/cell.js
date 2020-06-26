const knex = require('../../db/knex');

/**
 * Returns a transformed array of objects.
 * @param {Array} data
 * @returns {Array} - transformed array of objects.
 */
const transformCellLine = data => {
    return data.map(cell => {
        const { cell_id, cell_name, tissue_id, tissue_name } = cell;
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
 * Returns the transformed data for all the cell lines in the database.
 */
const cell_lines = async () => {
    try {
        const cell_lines = await knex
            .select()
            .from('cells')
            .join('tissues', 'cells.tissue_id', 'tissues.tissue_id');
        // return the transformed data.
        return transformCellLine(cell_lines);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    cell_lines
};
