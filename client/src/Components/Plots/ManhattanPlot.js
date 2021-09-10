import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const ManhattanPlot = (props) => {
    const { data, plotId} = props;
    const layout = {
        xaxis: {
            title: {
                text: 'Chromosome'
            },
            zeroline: false,
            showticklabels: false,
            range:[0, Math.max(...data.map(item => item.x))]
        },
        yaxis: {
            title: {
                text: '-log10(P)'
            },
            zeroline: false,
            range:[0, Math.max(...data.map(item => item.y)) + 1]
        },
        title: 'Manhattan Plot',
        hovermode: "closest",
    };
    
    const config = {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    }

    const [traces, setTraces] = useState([]);

    useEffect(() => {
        console.log(data);
        let xVals = data.map(item => item.x);
        let plotData = data.map(item => ({
            x: item.x,
            y: item.y,
            mode: 'markers',
            type: 'scatter',
            name: item.chr,
            text: [`${item.gene.symbol} - ${item.dataset.name} (${item.chr})`],
            marker: {
                color: item.color,
                size: 4
            },
            showlegend: false,
            hovertemplate: 
                `Gene: ${item.gene.symbol}<br>` +
                `Dataset: ${item.dataset.name}<br>` +
                `${item.fdr}<br>` +
                `${item.chr} - ${item.gene_seq_start}<br>`
        }));
        plotData.push({
            x: [Math.min(...xVals), Math.max(...xVals)],
            y: [-Math.log10(0.5), -Math.log10(0.5)],
            mode: 'lines',
            line: {
                color: '#000000',
                width: 1,
                dash: 'dot'
            },
            showlegend: false,
            hoverinfo: 'skip',
        });
        setTraces(plotData);
    }, []);

    return(
        <Plot 
            divId={plotId}
            data={traces} 
            layout={layout} 
            config={config} 
        />
    );
};

export default ManhattanPlot;
