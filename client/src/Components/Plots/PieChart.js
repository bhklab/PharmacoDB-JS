import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const layout = {
  height: 700,
  // width: 900,
  autosize: true,
  showlegend: window.matchMedia('(min-width: 800px)').matches,
  legend: {
    font: {
      size: 13,
    },
  },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

const PieChart = ({ data }) => <Plot data={data} layout={layout} config={config} />;

PieChart.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
};

export default PieChart;
