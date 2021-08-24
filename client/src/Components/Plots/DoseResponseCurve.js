import React from 'react';
import Plot from 'react-plotly.js';

const DoseResponseCurve = (props) => {
    const { plotData, plotId, showScatter, onHover, onUnhover, onClick} = props;

    return(
        <Plot 
            divId={plotId}
            data={plotData.traces} 
            layout={{
                autosize: true,
                height: 600,
                margin: {
                    t: 50,
                },
                xaxis: {
                    title: {
                        text: 'Log Concentration (uM)'
                    },
                    showgrid: false,
                    zeroline: false,
                    showline: true,
                    fixedrange: true,
                    range: [Math.log10(plotData.xMin), Math.log10(plotData.xMax)]
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
                    showline: true,
                    fixedrange: true,
                    range: [
                        showScatter ? plotData.yMin : 0, 
                        showScatter ? plotData.yMax + 5 : 100
                    ]
                },
                hovermode: "closest",
            }} 
            config={{
                responsive: true,
                displayModeBar: false,
            }} 
            onHover={onHover ? onHover : undefined}
            onUnhover={onUnhover ? onUnhover : undefined}
            onClick={onClick ? onClick : undefined}
        />
    );
}

export default DoseResponseCurve;