/**
 * 
 * @param {string} input - input string data
 * @returns {string} - returns a string
 */
const createSearchRegexString = (input) => input.split('').join('.{0,2}');

module.exports = {
    createSearchRegexString,
};
 