import React from 'react';
import Plot from 'react-plotly.js';
import datasets from '../../utils/datasetsList';

const data = [
  {
    x: datasets,
    y: [544, 343, 190, 107, 52, 44, 24, 8],
    type: 'bar',
    marker: {
      color: ['#084081', '#0868ac', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#e0f3db', '#f7fcf0'],
    },
  },
];

const layout = {
  autosize: true,
  height: 530,
  margin: {
    t: 50,
  },
};

const config = {
  responsive: true,
  displayModeBar: false,
};

const BarPlot = () => <Plot data={data} layout={layout} config={config} />;

export default BarPlot;
