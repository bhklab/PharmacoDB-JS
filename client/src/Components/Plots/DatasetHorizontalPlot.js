import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

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
const generatePlotlyData = (data) => {
  const output = {
    x: [],
    y: [],
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
 * return (
 *   <Plot data={[plotlyData]} layout={layout} config={config} />
 * )
 */
const DatasetHorizontalPlot = (props) => {
  const { data, xaxis } = props;
  // sorts data by count values
  data.sort((dataset1, dataset2) => dataset2.count - dataset1.count);
  const plotlyData = generatePlotlyData(data);

  const layout = {
    autosize: true,
    height: 530,
    margin: {
      t: 50,
    },
    xaxis: {
      color: colors.dark_teal_heading,
      title: {
        text: xaxis,
        font: {
          size: 16,
          family: 'Robot Slab, serif',

        },
        standoff: 10,
      },
    },
    yaxis: {
      color: colors.dark_teal_heading,
    },
  };
  return (
    <Plot data={[plotlyData]} layout={layout} config={config} />
  );
};

DatasetHorizontalPlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xaxis: PropTypes.string.isRequired,
};

export default DatasetHorizontalPlot;
