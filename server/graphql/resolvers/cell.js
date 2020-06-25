const knex = require('../../db/knex');

/**
 * Returns a transformed array of objects.
 * @param {array} data
 */
const transformCellLine = data => {
    return data.map(cell => {
        return {
            id: cell.cell_id,
            name: cell.cell_name,
            tissue: {
                id: cell.tissue_id,
                name: cell.tissue_name
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
