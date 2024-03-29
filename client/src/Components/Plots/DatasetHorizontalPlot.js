import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import colors from '../../styles/colors';
import { getDatasetsQuery } from '../../queries/dataset';
import DownloadButton from '../UtilComponents/DownloadButton';

const config = {
  responsive: true,
  displayModeBar: false,
};

/**
 * Generates single data point for plotly.
 *
 * @param {Array} data - array of objects that contain name, count and color properties
 *
 * @returns - {
 *  x: [446, 204, 113, 52, 11, 9, 1],
    y: ["CTRPv2", "GDSC1000", "GRAY", "FIMM", "CCLE", "gCSI", "UHNBreast"],
    type: 'bar',
    orientation: 'h',
    marker: {
      color: ["#2b8cbe", "#a8ddb5", "#ccebc5", "#4eb3d3", "#08589e", "#7bccc4", "#f0f9e8"],
    },
 * }
 */
const generatePlotlyData = (data, logScale) => {
  const output = {
    x: [],
    y: [],
    text: [],
    type: 'bar',
    orientation: 'h',
    marker: {
      color: [],
    },
  };
  data.forEach((dataset) => {
    output.x.push(Math.ceil(dataset.count));
    output.y.push(dataset.name);
    output.marker.color.push(dataset.color);
  });
  return output;
};

/**
 * A component that visualizes average statistic (experiments per cell lines or experiments per compounds)
 * for each dataset. Component uses plotly.js to render the plot
 *
 * @component
 * @example
 *
 * returns (
 *   <Plot data={[plotlyData]} layout={layout} config={config} />
 * )
 */
const DatasetHorizontalPlot = (props) => {
  const { plotId, data, xaxis, title, logScale } = props;

  // add datasets with 0 experiments to the plot
  const { loading, error, data: allDatasets } = useQuery(getDatasetsQuery);
  if (allDatasets) {
    allDatasets.datasets.forEach((dataset) => {
      let exist = false;
      data.forEach((d) => { if (d.name === dataset.name) exist = true; });
      if (!exist) data.push({ name: dataset.name, count: 0, color: '#ffffff' });
    });
  }

  // sorts data by count values
  data.sort((dataset1, dataset2) => dataset2.count - dataset1.count);
  const plotlyData = generatePlotlyData(data, logScale);
  const layout = {
    autoresize: true,
    height: 400,
    margin: {
      t: 20,
      b: 50,
      l: 65,
      r: 0,
    },
    xaxis: {
      color: colors.dark_teal_heading,
      title: {
        text: xaxis,
        font: {
          size: 14,
          family: 'arial',

        },
        standoff: 10,
      },
      type: logScale ? 'log' : 'linear'
    },
    yaxis: {
      color: colors.dark_teal_heading,
    },
  };

  if(logScale){
    layout.xaxis.tickvals = [0, 10, 100, 1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
    layout.xaxis.ticktext = [0, 10, 100, 1000, '10k', '50k', '100k', '500k', '1M', '5M', '10M'];
  };

  return (
    <div className="plot">
      <div className="title">
        <h5>{title}</h5>
      </div>
      <Plot divId={plotId} data={[plotlyData]} layout={layout} config={config} />
      <div className='download-buttons'>
        <DownloadButton className='left' label='SVG' mode='svg' filename={title} plotId={plotId} />
        <DownloadButton label='PNG' mode='png' filename={title} plotId={plotId} />
      </div>
    </div>
  );
};

DatasetHorizontalPlot.propTypes = {
  /**
   * [{name: "GDSC1000", count: 901.92, color: "#a8ddb5"}, ...]
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xaxis: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  logScale: PropTypes.bool
};

export default DatasetHorizontalPlot;
