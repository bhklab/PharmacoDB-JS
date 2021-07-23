// checks if the element is null or number.
const isNullOrNumber = function (element) {
    return element === null || element === 'number';
};

// checks if the element is null or string.
const isNullOrString = function (element) {
    return element === null || element === 'string';
};

// checks if the element is null or boolean.
const isNullOrBoolean = function (element) {
    return element === null || element === 'boolean';
};

module.exports = {
    isNullOrBoolean,
    isNullOrNumber,
    isNullOrString,
};
