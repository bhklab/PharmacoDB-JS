import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const layout = {
  height: 700,
  width: 900,
  showlegend: true,
  legend: {
    font: {
      size: 13,
    },
  },
};

const config = {
  displayModeBar: false,
};

const PieChart = ({ data }) => <Plot data={data} layout={layout} config={config} />;

PieChart.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
};

export default PieChart;
