/**
 *
 * @param {number} page
 * @param {number} per_page
 * @returns {Object} - {limit, offset}
 */
const calcLimitOffset = (page, per_page) => {
    // returns in case the page or per_page value is invalid
    if(page < 1 || per_page < 1) return new Error('Invalid parameters');

    const limit = per_page;
    const offset = (page - 1) * per_page;

    return { limit, offset };
};

module.exports = {
    calcLimitOffset
};
