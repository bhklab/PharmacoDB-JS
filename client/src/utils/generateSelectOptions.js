/**
 *
 * @param {Array} arr - array of string, takes the input to be converted to object usable by react-select library.
 * @returns {Array} - array of objects with value and label properties and removes __typename field added by apollo client
 */
const generateSelectOptions = (arr) => (
    arr.filter((el) => el !== '__typename').map((el) => ({ value: el, label: el }))
);

export default generateSelectOptions;
