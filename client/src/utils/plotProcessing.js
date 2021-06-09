import { calculateMedian, calculateAbsoluteDeviation } from './statistics';

/**
 * A helper function that formats raw experiment data to be subsequently processed be rendering functions
 * @param {Array} experiments - experiments data from the API call
 * @param {String} plotType - determines type of processing (and type of plot the processed data is going to be used in). Available values are 'tissue' and 'cell_line'
 * @returns {Object} - returns an object with cell or tissue as keys. Every cell line has three subfields: id, name and profiles. Profiles is an object of datasets where each dataset has two fields, AAC and IC50
 * @example
 * return { '697': {id: 1, name: '697', profiles: {CCLE: { AAC:0.4732, IC50: 0.1278 }, ...}}, ...}
 */
const formatExperimentPlotData = (experiments, plotType) => {
  const outputObj = {};
  experiments.forEach((experiment) => {
    const { __typename, ...profile } = experiment.profile;
    const { dataset } = experiment;
    // retrieves name and id properties of a tissue or cell line
    const { id, name } = experiment[plotType];
    if (!outputObj[name]) {
      outputObj[name] = { id, name, profiles: { [dataset.name]: plotType === 'tissue' ? [profile] : profile } };
    } else {
      // adds another dataset to an existing cell line
      if (plotType === 'cell_line') outputObj[name].profiles[dataset.name] = profile;
      // initializes new dataset for an existing tissue
      if (plotType === 'tissue' && !outputObj[name].profiles[dataset.name]) outputObj[name].profiles[dataset.name] = [profile];
      // adds profile to an tissue to an existing dataset
      if (plotType === 'tissue' && outputObj[name].profiles[dataset.name]) outputObj[name].profiles[dataset.name].push(profile);
    }
  });
  return outputObj;
};

/**
 *
 * @param {Array} arr - array of string, takes the input to be converted to object usable by react-select library.
 * @returns {Array} - array of objects with value and label properties and removes __typename field added by apollo client
 */
const generateSelectOptions = (arr) => arr.filter((el) => el !== '__typename').map((el) => ({ value: el, label: el }));

/**
 *
 * @param {Array} data - experiments data from the API call
 * @returns {Array} - returns an array of profile and dataset options respectively that can be used by react-select
 * @example
 * return [[{value: 'CCLE', label: 'CCLE'}, ...],[...]]
 */
const generateOptions = (data) => {
  const profileOptions = data.length > 0 ? Object.keys(data[0].profile) : [];
  const datasetOptions = ['All', ...new Set(data.map((el) => el.dataset.name))];
  return [generateSelectOptions(profileOptions), generateSelectOptions(datasetOptions)];
};

/**
 * A helper function that creates an array of values out of profile object
 * @param {Object} dataObj - profiles data object that has AAC and IC50 profiles for different datasets
 * @param {String} profile - a selected profile, can be AAC or IC50
 *  @param {String} plotType - type of that plot the data is being processed for. Can take 'tissue' and 'cell_line' values
 * @returns {Array} - returns array of numbers
 */
const retrieveProfiles = (dataObj, profile, dataset, plotType) => {
  const output = [];
  Object.keys(dataObj).forEach((datasetProfile) => {
    // filters out null values
    if (dataObj[datasetProfile][profile] === null) return;
    // only populates output array if there is a matching dataset or dataset are acceptable
    if (dataset === 'All' || dataset === datasetProfile) {
      if (plotType === 'tissue') output.push(...dataObj[datasetProfile].map((el) => el[profile]));
      if (plotType === 'cell_line') output.push(dataObj[datasetProfile][profile]);
    }
  });
  return output;
};

/**
 * Helper function that creates data for the gap between low and high values for the plot
 * @param {Number} distance - sets how many empty bars should be in the gap
 * @returns {Array} - returns an array of objects with value, name and label properties
 */
const generateEmptySpace = (distance) => {
  const output = [];
  for (let i = 0; i < distance; i += 1) {
    output.push({ value: 0, name: i, label: '' });
  }
  return output;
};

/**
 * Function that calculates median, deviation values, sorts data and creates a subset that will be further rendered
 * @param {Object} data - data object that has cell lines/tissues and their dataset profiles in it
 * @param {String} dataset - selected dataset
 * @param {String} profile - selected profile
 * @param {String} plotType - type of that plot the data is being processed for. Can take 'tissue' and 'cell_line' values
 * @returns {Object} - returns an array of objects (max length is 63) with value, deviation (for cell line only), name and label properties. Name and label properties exist separetely, even though they are being assigend to the same value. The reason is cell line plot needs them to be different to generate the empty space
 */
const runPlotDataAnalysis = (data, dataset, profile, plotType) => {
  const calculatedData = [];
  Object.values(data).forEach((group) => {
    const profiles = retrieveProfiles(group.profiles, profile, dataset, plotType);
    // updates calculated data only if there is at list one profile
    if (profiles.length > 0) {
      // loads all profiles for tissue plot and only median for cell_line plot
      const value = plotType === 'tissue' ? profiles : calculateMedian(profiles);
      const traceObj = { value, label: group.name, name: group.name };
      // adds deviation value for a cell line plot
      if (plotType === 'cell_line') traceObj.deviation = calculateMedian(calculateAbsoluteDeviation(profiles, value));
      calculatedData.push(traceObj);
    }
  });
  let output;
  if (plotType === 'tissue') output = calculatedData;
  if (plotType === 'cell_line') {
    calculatedData.sort((a, b) => b.value - a.value);
    // returns calculatedData or a subset of first and last 30 items from calculated data along with some few empty datapoints to create a gap if there too many dataoints
    output = calculatedData.length > 60 ? [...calculatedData.slice(0, 30), ...generateEmptySpace(3), ...calculatedData.slice(calculatedData.length - 30, calculatedData.length)] : calculatedData;
  }
  return output;
};

export { formatExperimentPlotData, generateOptions, runPlotDataAnalysis };
