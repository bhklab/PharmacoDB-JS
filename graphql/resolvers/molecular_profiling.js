const knex = require('../../knex');

/**
 *
 * @param {number} cellLineId
 * @param {string} cellLineName
 */
const molCellQuery = async (cellLineId, cellLineName) => {
    // main query.
    const query = knex
        .select('mc.dataset_id as dataset_id', 'd.name as dataset_name',
            'mc.mDataType as mDataType', 'mc.num_prof as num_prof',
            'c.id as cell_id', 'c.name as cell_name', 'c.cell_uid as cell_uid')
        .from('mol_cell as mc')
        .join('dataset as d', 'mc.dataset_id', 'd.id')
        .join('cell as c', 'mc.cell_id', 'c.id');
    // subquery.
    if (cellLineId) {
        return query.where('c.id', cellLineId);
    } else if (cellLineName) {
        return query.where('c.name', cellLineName);
    }
};

/**
 *
 * @param {Object} args
 * @returns {Object} - {
 *      cell_line: {id: 'cell id', name: 'cell name', uid: 'cell uid'},
 *      dataset: {id: 'dataset id', name: 'dataset name'},
 * 	    mDataType: 'molecular data type - String',
 * 		num_prof: 'number of profiles - Int',
 * }
 */
const molecular_profiling = async ({ cellLineId, cellLineName }) => {
    const molCellData = await molCellQuery(cellLineId, cellLineName);

    return molCellData.map(row => ({
        cell_line: {
            id: row.cell_id,
            name: row.cell_name,
            uid: row.cell_uid,
        },
        dataset: {
            id: row.dataset_id,
            name: row.dataset_name,
        },
        mDataType: row.mDataType,
        num_prof: row.num_prof,
    }));

};

module.exports = {
    molecular_profiling,
};
