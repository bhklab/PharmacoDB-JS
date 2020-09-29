/**
 *
 * @param {String} string - Takes string as an input (eg. adrenal gland).
 * @param {String} splitBy - second agrument is to split the string by. (eg '_', adernal_gland)
 * @returns {String} - returns a transformed string with the first letter capitalized for each word in the string(Title Case, eg. Adrenal Gland).
 */
const convertToTitleCase = (string, splitBy = ' ') => {
  const capitalString = string.split(splitBy).map((str) => {
    if (str === 'and') {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  return capitalString.join(' ');
};

export default convertToTitleCase;
