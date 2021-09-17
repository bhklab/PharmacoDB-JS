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
  height: 600,
  width: 1500,
  margin: {
    t: 20,
    b: 100,
    l: 65,
    r: 0,
  },
  xaxis: {
    color: colors.dark_teal_heading,
    tickfont: {
      size: 12,
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
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: {
        text: profile,
      },
      type: profile === 'AAC' ? '' : 'log',
    },
  };
  const notifications = {
    subset: data.length > 60 ? 'Plot represents the top and bottom 30 data points' : null,
    errorBars: dataset === 'All' ? 'Error Bars represent the Median Absolute Deviation' : null,
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
      x: [`${name} cell line`],
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
    layout.xaxis.tickvals.push(`${name} cell line`);
    layout.xaxis.ticktext.push(`<a href='${`/search?cell_line=${name}&compound=${compound}`}' rel="noopener noreferrer">${label}</a>`);
    plotData.push(trace);
  });
  return { plotData, layout, notifications };
};

/**
 * Waterfall plot that shows cell line profiles (AAC or IC50) for different datasets
 *
 * @component
 * @example
 *
 * return (
 *   <ProfileCellLine/>
 * )
 */
const ProfileCellLine = (props) => {
  const {
    plotId, data, compound, profileOptions, datasetOptions, title
  } = props;
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');
  const [{ plotData, layout, notifications }, setPlotData] = useState({ plotData: [], layout: {}, notifications: { subset: null, errorBars: null } });
  
  const history = useHistory();
  
  // preformats the data and creates selection options for datasets and profiles
  const formattedData = useMemo(() => formatExperimentPlotData(data, 'cell_line'), [data]);

  // updates the plot every time user selects new profile or dataset
  useEffect(() => {
    const values = runPlotDataAnalysis(formattedData, selectedDataset, selectedProfile, 'cell_line');
    setPlotData(generateRenderData(compound, values, selectedDataset, selectedProfile));
  }, [selectedProfile, selectedDataset, formattedData]);
  useEffect(() => {console.log(layout)}, [plotData]);

  /**
   * Redirects to Cell Line vs Compound page when a plot trace is clicked.
   * @param {*} e onclick event
   */
  const redirectToCellLineCompound = (e) => {
    history.push(`/search?cell_line=${e.points[0].fullData.name}&compound=${compound}`);
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
      <div style={{maxWidth: '800px', overflowX: 'scroll'}}>
        <Plot 
          divId={plotId}  
          data={plotData} 
          layout={layout} 
          config={config} 
          onClick={redirectToCellLineCompound}
        />
      </div>
      <div className="notifications">
        {notifications.subset ? (
          <p>
            <sup>* </sup>
            {notifications.subset}
          </p>
        ) : null}
        {notifications.errorBars ? (
          <p>
            <sup>** </sup>
            {notifications.errorBars}
          </p>
        ) : null}
      </div>
      <div className='download-buttons'>
        <DownloadButton className='left' label='SVG' mode='svg' filename={title} plotId={plotId} />
        <DownloadButton label='PNG' mode='png' filename={title} plotId={plotId} />
      </div>
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

export default ProfileCellLine;
