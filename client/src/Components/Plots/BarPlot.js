import React from 'react';
import Plot from 'react-plotly.js';

const data = [
  {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    type: 'bar',
  },
];

const BarPlot = () => <Plot data={data} />;

export default BarPlot;
