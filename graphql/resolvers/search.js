const { getGenesBasedOnSymbol } = require('./gene');
const { getDatasetsBasedOnName } = require('./dataset');
const { getCellLinesBasedOnName } = require('./cell');

/**
 * 
 * @param {number} id 
 * @param {string} value 
 * @param {string} type 
 * @returns {Object} -
 */
const transformData = (id, value, type) => ({
    id,
    value,
    type,
});

/**
 * 
 * @param {Array} data 
 * @returns {Array}
 */
const transformGenes = (data) => data.map((el) => transformData(el.id, el.symbol, 'gene'));

/**
 * 
 * @param {Array} data 
 * @returns {Array}
 */
const transformDatasets = (data) => data.map((el) => transformData(el.dataset_id, el.dataset_name, 'dataset'));

/**
 * 
 * @param {Array} data 
 * @returns {Array}
 */
const transformCellLines = (data) => data.map((el) => transformData(el.id, el.cell_uid, 'cell'));

/**
 * Returns 
 * @param {Object} args (input) - input string (can be anything like 'e', 'err', 'zzz')
 * @returns {Object} - returns list of data for different data types matching the input string
 */
const search = async ({ input }) => {
    const genes = transformGenes(await getGenesBasedOnSymbol(input));
    const datasets = transformDatasets(await getDatasetsBasedOnName(input));
    // const tissues = ;
    const cellLines = transformCellLines(await getCellLinesBasedOnName(input));
    // const compounds = ;

    return ([
        ...genes, 
        ...datasets,
        ...cellLines,
    ]);
};


module.exports = {
    search,
};
