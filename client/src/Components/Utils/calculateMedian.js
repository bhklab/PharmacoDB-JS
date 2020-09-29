/**
 *
 * @param {Array} arr - array of numbers, takes the input and generates median.
 * @returns {Number} - median value of the given set of numbers
 */
const calculateMedian = (arr) => {
  const half = Math.floor(arr.length / 2);
  if (arr.length % 2) return arr[half];
  return (arr[half - 1] + arr[half]) / 2.0;
};

export default calculateMedian;
