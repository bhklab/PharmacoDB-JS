import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import DownloadButton from '../UtilComponents/DownloadButton';
import StyledSelectorContainer from '../../styles/Utils/StyledSelectorContainer';
import { formatExperimentPlotData, runPlotDataAnalysis } from '../../utils/plotProcessing';


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
    b: 120,
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
    anchor: 'free',
    position: 0.020,
  },
  yaxis: {
    color: colors.dark_teal_heading,
    fixedrange: true,
  },
  showlegend: false,
};

/**
 * Function that creates final data and layout for plotly
 * @param {Array} data - array of object that represent a subset of data to be rendered. Every object has name, value, deviation(optional) and label properties
 * @returns {Object} - returns object with plotData and layout properties
 */
const generateRenderData = (compound, data, dataset, profile) => {
  const plotData = [];
  const layout = {
    ...baseLayout,
    xaxis: {
      ...baseLayout.xaxis,
      tickvals: [],
      ticktext: [],
      // draws tick labels vertically if there are more than 5 otherwise labels are horizontal
      tickangle: data.length > 5 ? -90 : 0,
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: {
        text: profile,
      },
      type: profile === 'AAC' ? '' : 'log',
      autorange: true,
    },
  };
  data.forEach((el, i) => {
    const { value, name } = el;
    const trace = {
      type: 'box',
      boxpoints: 'all',
      jitter: 1,
      pointpos: 0,
      hoveron: 'boxes',
      marker: {
        color: i % 2 === 0 ? colors.blue : colors.green,
        size: 2,
      },
      name: name,
      x: name,
      y: value,
    };
    layout.xaxis.tickvals.push(name);
    layout.xaxis.ticktext.push(`<a href='${`/search?tissue=${name}&compound=${compound}`}' rel='noopener noreferrer'>${name}</a>`);
    plotData.push(trace);
  });
  return { plotData, layout };
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
    plotId, data, compound, profileOptions, datasetOptions, title
  } = props;
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');
  const [{ plotData, layout }, setPlotData] = useState({ plotData: [], layout: {} });

  const history = useHistory();

  // preformats the data and creates selection options for datasets and profiles
  const formattedData = useMemo(() => formatExperimentPlotData(data, 'tissue'), [data]);
  // updates the plot every time user selects new profile or dataset
  useEffect(() => {
    const values = runPlotDataAnalysis(formattedData, selectedDataset, selectedProfile, 'tissue');
    setPlotData(generateRenderData(compound, values, selectedDataset, selectedProfile));
  }, [selectedProfile, selectedDataset, formattedData]);


  /**
   * Redirects to Tissue vs Compound page when a plot trace is clicked.
   * @param {*} e onclick event
   */
  const redirectToTissueCompound = (e) => {
    history.push(`/search?tissue=${e.points[0].fullData.name}&compound=${compound}`);
  }

  return (
    <div className="plot">
      <StyledSelectorContainer>
        <div className="selector-container">
          <div className='label'>Dataset:</div>
          <Select
            className='selector'
            defaultValue={{ value: selectedDataset, label: selectedDataset }}
            options={datasetOptions}
            onChange={(e) => setSelectedDataset(e.value)}
          />
        </div>
        <div className="selector-container">
          <div className='label'>Profile:</div>
          <Select
            className='selector'
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
      <Plot 
        divId={plotId} 
        data={plotData} 
        layout={layout} 
        config={config} 
        onClick={redirectToTissueCompound}
      />
      <div className='download-buttons'>
        <DownloadButton className='left' label='SVG' mode='svg' filename={title} plotId={plotId} />
        <DownloadButton label='PNG' mode='png' filename={title} plotId={plotId} />
      </div>
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
