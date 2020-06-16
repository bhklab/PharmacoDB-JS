const knex = require('../../db/knex');

/**
 * Returns the transformed data for all the cell lines in the database.
 */
const cell_lines = async () => {
    try {
        const cell_lines = await knex.select().from('cells');
        return cell_lines.map(cell => {
            return {
                id: cell.cell_id,
                name: cell.cell_name
            };
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = {
    cell_lines
};
