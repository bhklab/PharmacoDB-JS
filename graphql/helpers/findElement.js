/**
 * 
 * @param {Array} list - list of the elements to find the element in
 * @param {number|string} element - element to be found
 * @param {string} key - using this to match if the element of the array is an object
 */
const findElement = function(list, element, key) {
    // if the list is empty or element is not provided simply return
    if(list.length === 0 || !element) return;

    return list.find(el => el[key] === element);
};

module.exports = {
    findElement
};
