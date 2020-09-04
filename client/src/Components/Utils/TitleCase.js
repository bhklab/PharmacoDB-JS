/**
 *
 * @param {String} string - Takes string as an input.
 * @returns {String} - returns a transformed string with the first letter capitalized for each word (Title Case).
 */
const TitleCase = (string) => {
  const capitalString = string.split(' ').map((str) => {
    if (str === 'and') {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  return capitalString.join(' ');
};

export default TitleCase;
