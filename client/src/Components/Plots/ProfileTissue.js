import React, { useState, useMemo, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import PropTypes from 'prop-types';
import StyledSelectorContainer from '../../styles/Utils/StyledSelectorContainer';
import { formatExperimentPlotData } from '../../utils/plotProcessing';
import colors from '../../styles/colors';

// plotly config
const config = {
  responsive: true,
  displayModeBar: false,
};

// reusable layout object
const baseLayout = {
  title: 'Example title',
  autoresize: true,
  height: 530,
  margin: {
    t: 20,
    b: 60,
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
  console.log(dataObj, profile, dataset);
  Object.keys(dataObj).forEach((datasetProfile) => {
    // filters out null values
    if (dataObj[datasetProfile][profile] === null) return;
    // only populates output array if there is a matching dataset or dataset are acceptable
    if (dataset === 'All' || dataset === datasetProfile) {
      console.log(dataObj, datasetProfile, profile);
      output.push(...dataObj[datasetProfile].map((el) => el[profile]));
    }
  });
  return output;
};

/**
 * Function that creates final data and layout for plotly
 * @param {Array} data - array of object that represent a subset of data to be rendered. Every object has name, value, deviation(optional) and label properties
 * @returns {Object} - returns object with plotData and layout properties
 */
const generateRenderData = (data, dataset, profile) => {
  console.log(data);
  const plotData = [];
  const layout = {
    ...baseLayout,
    xaxis: {
      ...baseLayout.xaxis,
      tickvals: [],
      ticktext: [],
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: {
        text: profile,
      },
    },
  };
  data.forEach((el, i) => {
    const {
      name, values, label,
    } = el;
    const trace = {
      type: 'box',
      marker: {
        color: i % 2 === 0 ? colors.blue : colors.green,
      },
      name,
      // x: [`${name} cell line`],
      y: values,
    };
    // skips hoverinfo for gap bars
    if (!label) trace.hoverinfo = 'skip';

    layout.xaxis.tickvals.push(`${name} cell line`);
    layout.xaxis.ticktext.push(label);
    plotData.push(trace);
  });
  return { plotData, layout };
};

/**
 * Function that calculates median, deviation values, sorts data and creates a subset that will be further rendered
 * @param {Object} data - data object that has cell lines and their dataset profiles in it
 * @param {String} dataset - selected dataset
 * @param {String} profile - selected profile
 * @returns {Object} - returns an array of objects (max length is 63) with value, deviation, name and label properties
 */
const runDataAnalysis = (data, dataset, profile) => {
  // calculates median and deviation values and sort cell lines based on median
  console.log(data);
  const calculatedData = [];
  Object.values(data).forEach((tissue) => {
    const profiles = retrieveProfiles(tissue.profiles, profile, dataset);
    // updates calculated data only if there is at list one profile
    if (profiles.length > 0) {
      calculatedData.push({
        values: profiles, name: tissue.name, label: tissue.name,
      });
    }
  });
  calculatedData.sort((a, b) => b.value - a.value);
  return calculatedData;
};

/**
 * Waterfall plot that shows cell line profiles (AAC or IC50) for different datasets
 *
 * @component
 * @example
 *
 * return (
 *   <ProfileTissue/>
 * )
 */
const ProfileTissue = (props) => {
  const {
    data, compound, profileOptions, datasetOptions,
  } = props;
  console.log(data);
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');
  const [{ plotData, layout }, setPlotData] = useState({ plotData: [], layout: {} });
  // preformats the data and creates selection options for datasets and profiles
  const formattedData = useMemo(() => formatExperimentPlotData(data, 'tissue'), [data]);
  // updates the plot every time user selects new profile or dataset
  useEffect(() => {
    const values = runDataAnalysis(formattedData, selectedDataset, selectedProfile);
    console.log(values);
    setPlotData(generateRenderData(values, selectedDataset, selectedProfile));
  }, [selectedProfile, selectedDataset, formattedData]);
  console.log(plotData);
  return (
    <div className="plot">
      <StyledSelectorContainer>
        <div className="selector-container">
          <h4>Select Dataset </h4>
          <Select
            defaultValue={{ value: selectedDataset, label: selectedDataset }}
            options={datasetOptions}
            onChange={(e) => setSelectedDataset(e.value)}
          />
        </div>
        <div className="selector-container">
          <h4>Select Profile </h4>
          <Select
            defaultValue={{ value: selectedProfile, label: selectedProfile }}
            options={profileOptions}
            onChange={(e) => setSelectedProfile(e.value)}
          />
        </div>
      </StyledSelectorContainer>
      <h3>
        {compound}
        ,
        {' '}
        {selectedProfile}
        {' '}
        {selectedDataset !== 'All' ? `(${selectedDataset})` : null}
      </h3>
      <Plot data={plotData} layout={layout} config={config} />
    </div>
  );
};

ProfileTissue.propTypes = {
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
  profileOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  datasetOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  compound: PropTypes.string.isRequired,
};

export default ProfileTissue;
