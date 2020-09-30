/**
 *
 * @param {Array} values - array of numbers, takes the input and generates median.
 * @returns {Number} - median value of the given set of numbers
 */
const calculateMedian = (values) => {
  values.sort();
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

const calculateAbsoluteDeviation = (values, median) => values.map((el) => Math.abs(el - median));

export { calculateMedian, calculateAbsoluteDeviation };
