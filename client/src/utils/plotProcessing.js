/**
 * A helper function that formats raw experiment data to be subsequently processed be rendering functions
 * @param {Array} experiments - experiments data from the API call
 * @param {String} accessor - determines type of processing (and type of plot the processed data is going to be used in). Available values are 'tissue' and 'cell_line'
 * @returns {Object} - returns an object with cell or tissue as keys. Every cell line has three subfields: id, name and profiles. Profiles is an object of datasets where each dataset has two fields, AAC and IC50
 * @example
 * return { '697': {id: 1, name: '697', profiles: {CCLE: { AAC:0.4732, IC50: 0.1278 }, ...}}, ...}
 */
const formatExperimentPlotData = (experiments, accessor) => {
  const outputObj = {};
  experiments.forEach((experiment) => {
    const { __typename, ...profile } = experiment.profile;
    const { dataset } = experiment;
    if (!outputObj[experiment[accessor].name]) {
      outputObj[experiment[accessor].name] = {
        id: experiment[accessor].id,
        name: experiment[accessor].name,
        profiles: { [dataset.name]: profile },
      };
    } else {
      outputObj[experiment[accessor].name].profiles[experiment.dataset.name] = profile;
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

export { formatExperimentPlotData, generateOptions };
