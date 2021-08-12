import React from 'react';
import Plot from 'react-plotly.js';

const layout = {
    autosize: true,
    height: 530,
    margin: {
      t: 50,
    },
    xaxis: {
        title: {
            text: 'Concentration (uM)'
        },
        showgrid: false,
        zeroline: false,
        showline: true
    },
    yaxis: {
        title: {
            text: 'Response'
        },
        tickmode: 'linear',
        tick0: 0,
        dtick: 10,
        showgrid: false,
        zeroline: false,
        showline: true
    }
};

const config = {
    responsive: true,
    displayModeBar: false,
};

const DoseResponseCurve = (props) => {
    const { data } = props;
    return(
        <Plot 
            data={data} 
            layout={layout} 
            config={config} 
        />
    );
}

export default DoseResponseCurve;