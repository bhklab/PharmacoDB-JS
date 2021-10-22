/**
 *
 * @param {number} page
 * @param {number} per_page
 * @returns {Object} - {limit, offset}
 */
const calcLimitOffset = (page, per_page) => {
    const limit = per_page;
    const offset = (page - 1) * per_page;
    return { limit, offset };
};

module.exports = {
    calcLimitOffset
};