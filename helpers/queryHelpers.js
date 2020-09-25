/**
 * 
 * @param {Object} - info object generated by graphQL and passed as a 3rd argument to resolver functions. IMPORTANT: Official documentation states that it's a 4th argument which is not the case here because there is no parent resolver function 
 * @returns {Array} - returns array of objects with name and fields properties that reprsent fields requested by graphQL client
 */
const retrieveFields = info => retrieveSelectionSet(info.fieldNodes[0].selectionSet);

/**
 *  Recursive helper function that retrieves fields requested by the user from the selectionSet subfield of the info argument generated by graphQL resolver function. Filters out __typename field generated by apollo client
 * @param {Object} - info object generated by graphQL and passed as a 3rd argument to resolver functions.
 * @returns {Array} - returns array of objects with name and fields properties that reprsent fields requested by graphQL client
 */
const retrieveSelectionSet = selectionSet => selectionSet.selections.map(el => {
    return {
        name: el.name.value,
        fields: el.selectionSet ? retrieveSelectionSet(el.selectionSet) : null
    };
}).filter(el => el.name !== '__typename');

/**
 * Helper function that return list of unique subtypes (sometimes types are getting duplicated)
 * @param {Array} - output of the retrieveFields helper function .
 * @returns {Array} - returns array of strings that represent subtypes in graphQL query
 * [ 'cell_line',
  'compound',
  'annotation',
  'tissue',
  'dataset',
  'dose_responses' ]
 */
const retrieveSubtypes = listOfFields => [...new Set(generateTypeFields(listOfFields))];

/**
 * Recursive helper function that return list of types based on output from retrieveFields function
 * @param {Array} - output of the retrieveFields helper function .
 * @returns {Array} - returns array of strings that represent subtypes in graphQL query
 * [ 'cell_line',
  'compound',
  'tissue',
  'annotation',
  'tissue',
  'dataset',
  'dose_responses' ]
 */
const generateTypeFields = listOfFields => listOfFields.reduce(function (filtered, element) {
    const { name, fields } = element;
    if (fields) filtered.push(name, ...retrieveSubtypes(fields));
    return filtered;
}, []);

module.exports = {
    retrieveFields,
    retrieveSubtypes
};