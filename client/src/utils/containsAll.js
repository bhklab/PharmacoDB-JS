/**
 * 
 * @param {Array} inputArray - array of input values against which the checkValues are checked.
 * @param {Array} checkValues - array of values that needs to checked if they are all present in the input array or not.
 * @returns {boolean} - return true if all the elements are present in the input array else false.
 */
const containsAll = (inputArray, checkValues) => {
    // if the length of the input array or the values to be checked is equal to zero return false.
    if (inputArray.length === 0 || checkValues.length === 0) return false;

    // will return true if all the elements are present else false.
    return checkValues.every(el => inputArray.includes(el));
};

export default containsAll;
