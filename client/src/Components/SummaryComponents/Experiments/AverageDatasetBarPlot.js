import React from 'react';
import Plot from 'react-plotly.js';

const data = [
  {
    x: ['CTRPV2', 'GDSC1000', 'GRAY', 'FIMM', 'CCLE', 'gCSI', 'UHNBreast'],
    y: [544, 250, 90, 52, 26, 16, 4],
    type: 'bar',
    marker: {
      color: ['#08589e', '#2b8cbe', '#4eb3d3', '#7bccc4', '#a8ddb5', '#ccebc5', '#f0f9e8'],
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

const AverageDatasetBarPlot = () => <Plot data={data} layout={layout} config={config} />;

export default AverageDatasetBarPlot;
