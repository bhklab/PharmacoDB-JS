/**
 *
 * @param {String} string - takes the input to be converted to snake case. (eg. Annotated Targets)
 * @param {String} splitInputBy - this is how the string is joined and has to be split on. (eg. '_' (Annotated_Targets))
 * @returns {String} - returns a snake cased string (eg. annotated_targets)
 */

const convertToSnakeCase = (string, splitInputBy = ' ') =>
    string
        .split(splitInputBy)
        .map((value) => value.toLowerCase())
        .join('_');

export default convertToSnakeCase;
