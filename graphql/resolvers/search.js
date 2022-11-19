const { getGenesBasedOnSymbol } = require('./gene');
const { getDatasetsBasedOnName } = require('./dataset');
const { getCellLinesBasedOnName } = require('./cell');
const { getCompoundBasedOnName } = require('./compound');
const { getTissueBasedOnName } = require('./tissue');

/**
 * 
 * @param {number} id 
 * @param {string} value 
 * @param {string} type 
 * @returns {Object}
 */
const transformData = (id, value, type) => ({
    id,
    value,
    type,
});

/**
 * 
 * @param {Array} data - an array of genes
 * @returns {Array}
 */
const transformGenes = (data) => data.map((el) => (
    transformData(el.id, el.symbol, 'gene')
));

/**
 * 
 * @param {Array} data - an array of datasets
 * @returns {Array}
 */
const transformDatasets = (data) => data.map((el) => (
    transformData(el.dataset_id, el.dataset_name, 'dataset')
));

/**
 * 
 * @param {Array} data - an array of cell lines
 * @returns {Array}
 */
const transformCellLines = (data) => data.map((el) => (
    transformData(el.cell_uid, el.name, 'cell')
));

/**
 * 
 * @param {Array} data - an array of compounds
 * @returns {Array}
 */
const transformCompounds = (data) => data.map((el) => (
    transformData(el.compound_uid, el.name, 'compound')
));

/**
 * 
 * @param {Array} data - an array of tissues
 * @returns {Array}
 */
const transformTissues = (data) => data.map((el) => (
    transformData(el.id, el.name, 'tissue')
));


/**
 * @param {Object} args (input) - input string (can be anything like 'e', 'err', 'zzz')
 * @returns {Object} - returns list of data for different data types matching the input string
 */
const search = async ({ input }) => {
    const genes = transformGenes(await getGenesBasedOnSymbol(input));
    const datasets = transformDatasets(await getDatasetsBasedOnName(input));
    const cellLines = transformCellLines(await getCellLinesBasedOnName(input));
    const compounds = transformCompounds(await getCompoundBasedOnName(input));
    const tissues = transformTissues(await getTissueBasedOnName(input));

    return ([
        ...genes, 
        ...datasets,
        ...cellLines, 
        ...compounds,
        ...tissues,
    ]);
};


module.exports = {
    search,
};
