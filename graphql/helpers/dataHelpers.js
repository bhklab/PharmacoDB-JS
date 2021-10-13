/**
 * 
 * @param {Number} - value which is either 1 or 0.
 * @returns {String}
 */
const transformFdaStatus = value => (value ? 'Approved' : 'NA');

module.exports = {
    transformFdaStatus
};
