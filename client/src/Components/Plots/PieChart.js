import React from 'react';
import Plot from 'react-plotly.js';

const data = [{
  values: [16, 15, 12, 6, 5, 4, 42],
  labels: ['US', 'China', 'European Union', 'Russian Federation', 'Brazil', 'India', 'Rest of World'],
  name: 'GHG Emissions',
  hoverinfo: 'label+percent+name',
  hole: 0.55,
  type: 'pie',
}];

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

const PieChart = () => <Plot data={data} layout={layout} config={config} />;

export default PieChart;
