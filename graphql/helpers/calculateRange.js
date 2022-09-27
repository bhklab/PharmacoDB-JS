/**
 *
 * @param {number} page
 * @param {number} per_page
 * @returns {Object} {lowerBound, upperBound} - lowerbound and upperbound to be used as a range
 */
const calculateRange = (page, per_page) => {
    // returns in case the page or per_page value is invalid
    if(page < 1 || per_page < 1) return new Error('Invalid parameters');

    // variables to store the upper and lower bound 
    const lowerBound = page === 1 ? 1 : (page - 1) * per_page + 1;
    const upperBound = page * per_page;

    return {lowerBound, upperBound};
};

module.exports = {
    calculateRange
};
