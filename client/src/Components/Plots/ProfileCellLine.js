import React, { useState, useMemo, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import StyledSelectorContainer from '../../styles/Utils/StyledSelectorContainer';
import generateSelectOptions from '../../utils/generateSelectOptions';
import { calculateMedian, calculateAbsoluteDeviation } from '../../utils/statistics';
import colors from '../../styles/colors';

// plotly config
const config = {
  responsive: true,
  displayModeBar: false,
};

// reusable layout object
const baseLayout = {
  autoresize: true,
  height: 530,
  margin: {
    t: 20,
    b: 50,
    l: 65,
    r: 0,
  },
  xaxis: {
    color: colors.dark_teal_heading,
    tickfont: {
      size: 9,
    },
    fixedrange: true,
    tickmode: 'array',
  },
  yaxis: {
    color: colors.dark_teal_heading,
    fixedrange: true,
  },
  bargap: 0,
  showlegend: false,
};

/**
 * A helper function that creates an array of values out of profile object
 * @param {Object} dataObj - profiles data object that has AAC and IC50 profiles for different datasets
 * @param {String} profile - a selected profile, can be AAC or IC50
 * @returns {Array} - returns array of numbers
 */
const retrieveProfiles = (dataObj, profile, dataset) => {
  const output = [];
  Object.keys(dataObj).forEach((datasetProfile) => {
    console.log(dataset, datasetProfile);
    // filters out null values
    if (dataObj[datasetProfile][profile] === null) return;
    // only populates output array if there is a matching dataset or dataset are acceptable
    if (dataset === 'All' || dataset === datasetProfile) {
      output.push(dataObj[datasetProfile][profile]);
    }
  });
  return output;
};

/**
 * A helper function that formats raw experiment data to be subsequently processed be rendering functions
 * @param {Array} experiments - experiments data from the API call
 * @returns {Object} - returns an object with cell_names as keys. Every cell line has three subfields: id, name and profiles. Profiles is an object of datasets where each dataset has two fields, AAC and IC50
 * @example
 * return { '697': {id: 1, name: '697', profiles: {CCLE: { AAC:0.4732, IC50: 0.1278 }, ...}}, ...}
 */
const formatCellData = (experiments) => {
  const cellObj = {};
  experiments.forEach((experiment) => {
    const { __typename, ...profile } = experiment.profile;
    const { cell_line, dataset } = experiment;
    if (!cellObj[cell_line.name]) {
      cellObj[cell_line.name] = {
        id: cell_line.id,
        name: cell_line.name,
        profiles: { [dataset.name]: profile },
      };
    } else {
      cellObj[experiment.cell_line.name].profiles[experiment.dataset.name] = profile;
    }
  });
  return cellObj;
};

/**
 *
 * @param {Array} data - experiments data from the API call
 * @returns {Array} - returns an array of profile and dataset options respectively that can be used by react-select
 * @example
 * return [[{value: 'CCLE', label: 'CCLE'}, ...],[...]]
 */
const generateOptions = (data) => {
  const profileOptions = Object.keys(data[0].profile);
  const datasetOptions = ['All', ...new Set(data.map((el) => el.dataset.name))];
  return [generateSelectOptions(profileOptions), generateSelectOptions(datasetOptions)];
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
 * Function that creates final data and layout for plotly
 * @param {Array} data - array of object that represent a subset of data to be rendered. Every object has name, value, deviation(optional) and label properties
 * @returns {Object} - returns object with plotData and layout properties
 */
const generateRenderData = (data) => {
  const plotData = [];
  const layout = {
    ...baseLayout,
    xaxis: {
      ...baseLayout.xaxis,
      tickvals: [],
      ticktext: [],
    },
  };
  data.forEach((el, i) => {
    const {
      name, value, deviation, label,
    } = el;
    const trace = {
      type: 'bar',
      marker: {
        color: i % 2 === 0 ? colors.blue : colors.green,
      },
      name,
      x: [name],
      y: [value],
    };
    // skips hoverinfo for gap bars
    if (!label) trace.hoverinfo = 'skip';
    if (deviation) {
      trace.error_y = {
        type: 'data',
        array: [deviation],
        visible: true,
      };
    }
    layout.xaxis.tickvals.push(name);
    layout.xaxis.ticktext.push(label);
    plotData.push(trace);
  });
  return { plotData, layout };
};

const runDataAnalysis = (data, dataset, profile) => {
  // calculates median and deviation values and sort cell lines based on median
  console.log(dataset, profile);
  const calculatedData = Object.values(data).map((el) => {
    // if (dataset) {
    //   const profiles = retrieveProfiles(el.profiles, profile, dataset);
    //   const value = calculateMedian(profiles);
    //   const deviation = calculateMedian(calculateAbsoluteDeviation(profiles, value));
    // }

    const profiles = retrieveProfiles(el.profiles, profile, dataset);
    const value = calculateMedian(profiles);
    const deviation = calculateMedian(calculateAbsoluteDeviation(profiles, value));
    return {
      value, deviation, name: el.name, label: el.name,
    };
  }).sort((a, b) => b.value - a.value);
  console.log(calculatedData);
  // contains first and last 30 items from calculated data along with some few empty datapoints to create a gap
  return [...calculatedData.slice(0, 30), ...generateEmptySpace(3), ...calculatedData.slice(calculatedData.length - 30, calculatedData.length)];
};

const ProfileCellLine = (props) => {
  const { data, compound } = props;
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');

  const formattedData = useMemo(() => formatCellData(data), [data]);
  const [profileOptions, datasetOptions] = useMemo(() => generateOptions(data), [data]);

  const [{ plotData, layout }, setPlotData] = useState(runDataAnalysis(formattedData, selectedDataset, selectedProfile));

  useEffect(() => {
    const values = runDataAnalysis(formattedData, selectedDataset, selectedProfile);
    setPlotData(generateRenderData(values));
  }, [selectedProfile, selectedDataset]);

  return (
    <div className="plot">
      <StyledSelectorContainer>
        <div className="selector-container">
          <h3>Select Dataset </h3>
          <Select
            defaultValue={{ value: selectedDataset, label: selectedDataset }}
            options={datasetOptions}
            onChange={(e) => setSelectedDataset(e.value)}
          />
        </div>
        <div className="selector-container">
          <h3>Select Profile </h3>
          <Select
            defaultValue={{ value: selectedProfile, label: selectedProfile }}
            options={profileOptions}
            onChange={(e) => setSelectedProfile(e.value)}
          />
        </div>
      </StyledSelectorContainer>
      <h4>
        {compound}
        ,
        {' '}
        {selectedProfile}
        {' '}
        {selectedDataset !== 'All' ? `(${selectedDataset})` : null}
      </h4>
      <Plot data={plotData} layout={layout} config={config} />
    </div>
  );
};

ProfileCellLine.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      cell_line: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        tissue: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      dataset: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      tissue: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      profile: PropTypes.shape({
        AAC: PropTypes.number,
        IC50: PropTypes.number,
      }).isRequired,
    }),
  ).isRequired,
  compound: PropTypes.string.isRequired,
};

export default ProfileCellLine;
