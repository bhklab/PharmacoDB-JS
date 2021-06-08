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
  console.log(accessor, experiments);
  experiments.forEach((experiment) => {
    console.log(outputObj);
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

export default formatExperimentPlotData;
