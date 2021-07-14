const knex = require('../../db/knex');

/**
 *
 * @param {number} cellLineId
 * @param {string} cellLineName
 */
const molCellQuery = async (cellLineId, cellLineName) => {
    // main query.
    const query = knex
        .select('mc.dataset_id as dataset_id', 'd.name as dataset_name', 'mc.mDataType as mDataType', 'mc.num_prof as num_prof')
        .from('mol_cell as mc')
        .join('dataset as d', 'mc.dataset_id', 'd.id')
        .join('cell as c', 'mc.cell_id', 'c.id')
    // subquery.
    if (cellLineId) {
        return query.where('c.id', cellLineId);
    } else if (cellLineName) {
        return query.where('c.name', cellLineName);
    }
};

/**
 *
 * @param {number} cellLineId
 * @param {string} cellLineName
 */
const dataTypesQuery = async (cellLineId, cellLineName) => {
    // main query.
    const query = knex
        .distinct('mc.mDataType as mDataType')
        .from('mol_cell as mc')
        .join('cell as c', 'mc.cell_id', 'c.id')
    // subquery.
    if (cellLineId) {
        return query.where('c.id', cellLineId);
    } else if (cellLineName) {
        return query.where('c.name', cellLineName);
    }
};

const transformMols= data => {
    return data.map(mol => {
        const {
            dataset_id,
            dataset_name,
            mDataType,
            num_prof,
        } = cell;
        const output = {
            dataset_id,
            dataset_name,
            mol: {
                dataType: mDataType,
                num_prof: num_prof
            }
        };
        return output;
    });
};

/**
 *
 * @param {Object} args
 * @returns {Object} - {
 *      dataset_id: 'dataset id - Int',
 * 		dataset_name: 'dataset name - String',
 * 	    mDataType: 'molecular data type - String',
 * 		num_prof: 'number of profiles - Int',
 * }
 */
const mol_cell = async (args) => {
    const {
        cellLineId,
        cellLineName
    } = args;
    const returnObject = [];
    const molCells = await molCellQuery(cellLineId, cellLineName);

    molCells.forEach((molcell, i) => {
        molProfObject = [];
        const {
            dataset_id,
            dataset_name,
            mDataType,
            num_prof,
        } = molcell;

        molProfObject['dataset_id'] = dataset_id;
        molProfObject['dataset_name'] = dataset_name;
        molProfObject['mDataType'] = mDataType;
        molProfObject['num_prof'] = num_prof;

        returnObject.push(molProfObject);
        }
    );
    return returnObject;
};

module.exports = {
    mol_cell
};
