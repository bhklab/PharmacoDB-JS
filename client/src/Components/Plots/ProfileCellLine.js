import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import CustomSwitch from '../UtilComponents/CustomSwitch';
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

/**
 * Function that creates final data and layout for plotly
 * @param {Array} data - array of object that represent a subset of data to be rendered. Every object has name, value, deviation(optional) and label properties
 * @returns {Object} - returns object with plotData and layout properties
 */
const generateRenderData = (data, dataset) => {
  const plotData = [];
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
      label,
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
    plotData.push(trace);
  });
  return { plotData, notifications };
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
  const [zoomOut, setZoomOut] = useState(false);
  const [{ plotData, notifications }, setPlotData] = useState({ plotData: [], notifications: { subset: null, errorBars: null } });
  const [layoutVariables, setLayoutVariables] = useState({
    width: 1500,
    maxWidth: '800px',
    overflowX: 'scroll',
    xTickFontSize: 12,
  });
  
  const history = useHistory();
  
  // preformats the data and creates selection options for datasets and profiles
  const formattedData = useMemo(() => formatExperimentPlotData(data, 'cell_line'), [data]);

  // updates the plot every time user selects new profile or dataset
  useEffect(() => {
    const values = runPlotDataAnalysis(formattedData, selectedDataset, selectedProfile, 'cell_line');
    setPlotData(generateRenderData(values, selectedDataset));
  }, [selectedProfile, selectedDataset, formattedData]);

  useEffect(() => {
    setLayoutVariables({
      maxWidth: zoomOut ? '1000px' : '800px',
      overflowX: zoomOut ? undefined : 'scroll',
      width: zoomOut ? 800 : 1500,
      xTickFontSize: zoomOut ? 9 : 12
    });
  }, [zoomOut]);

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
        <div className="selector-container">
          <div className='label'>Zoom:</div>
          <CustomSwitch 
            checked={zoomOut}
            onChange={(checked) => {setZoomOut(checked)}}
            labelLeft='In'
            labelRight='Out'
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
      <div style={{height: '650px', maxWidth: layoutVariables.maxWidth, overflowX: layoutVariables.overflowX}}>
        <Plot 
          divId={plotId}  
          data={plotData} 
          layout={{
            autoresize: true,
            height: 600,
            width: layoutVariables.width,
            margin: {
              t: 20,
              b: 150,
              l: 65,
              r: 0,
            },
            xaxis: {
              color: colors.dark_teal_heading,
              tickvals: plotData.map(trace => `${trace.name} cell line`),
              ticktext: plotData.map(trace => 
                `<a href='${`/search?cell_line=${trace.name}&compound=${compound}`}' rel="noopener noreferrer">${trace.label}</a>`
              ),
              tickfont: {
                size: layoutVariables.xTickFontSize,
              },
              fixedrange: true,
              tickmode: 'array',
            },
            yaxis: {
              color: colors.dark_teal_heading,
              fixedrange: true,
              title: {
                text: selectedProfile,
              },
              type: selectedProfile === 'AAC' ? '' : 'log',
            },
            bargap: 0,
            showlegend: false,
          }} 
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
