import React from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const layout = {
  annotations: [
    {
      font: {
        size: 20,
      },
      showarrow: false,
      x: 0.17,
      y: 0.5,
    },
  ],
  height: 700,
  width: 900,
  showlegend: true,
};

const config = {
  displayModeBar: false,
};

const PieChart = ({ data }) => <Plot data={data} layout={layout} config={config} />;

PieChart.propTypes = {
  data: PropTypes.arrayOf(Object).isRequired,
};

export default PieChart;
