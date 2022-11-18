const knex = require('../../db/knex');
const { getGenesBasedOnSymbol } = require('./gene');


/**
 * 
 * @param {Array} data 
 * @param {string} type 
 * @returns {Array} - array of object with updated object with addition of type.
 */
const addTypeField = (data, type) => data.map(el => ({...el, type}));


/**
 * Returns 
 * @param {Object} args (input) - input string (can be anything like 'e', 'err', 'zzz')
 * @returns {Object} - returns list of data for different data types matching the input string
 */
const search = async ({ input }) => {
    const genes = addTypeField(await getGenesBasedOnSymbol(input), 'gene');

    return (genes);
};


module.exports = {
    search,
};
