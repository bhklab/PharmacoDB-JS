/**
 * 
 * @param {number} windowInnerWidth 
 * @returns {string}
 */
const getMaxWidth = (windowInnerWidth) => {
    return windowInnerWidth > 1500 ? '55vw' : '65vw';
};

export default getMaxWidth;
