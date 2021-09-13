import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import DownloadButton from '../UtilComponents/DownloadButton';
import styled from 'styled-components';

const StyledManhattanPlot = styled.div`
    .download-buttons {
        display: flex;
        justify-content: flex-end;
        .left {
            margin-right: 5px;
        }
    }
`;

const ManhattanPlot = (props) => {
    const { title, data, xRange, xLabelValues, plotId } = props;
    const layout = {
        autoresize: true,
        height: 400,
        margin: {
            t: 40,
            b: 50,
            l: 65,
            r: 10,
        },
        xaxis: {
            title: {
                text: 'Chromosome'
            },
            zeroline: false,
            showticklabels: true,
            range: xRange,
            tickangle: -90,
            tickmode: "array",
            tickvals: xLabelValues.values,
            ticktext: xLabelValues.labels,
            tickfont: {
                size: 11
            },
            showgrid: false
        },
        yaxis: {
            title: {
                text: '-log10(p value)'
            },
            zeroline: false,
            range: [0, Math.max(...data.map(item => item.y)) + 0.5]
        },
        title: title,
        hovermode: "closest",
    };

    const config = {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    }

    const [traces, setTraces] = useState([]);

    useEffect(() => {
        let plotData = [];

        plotData.push({
            x: data.map(item => item.x),
            y: data.map(item => item.y),
            name: '',
            mode: 'markers',
            type: 'scattergl',
            marker: {
                color: data.map(item => item.color),
                size: 3
            },
            showlegend: false,
            hoverlabel: {
                bgcolor: data.map(item => item.color),
                font: {
                    size: 11
                }
            },
            hovertemplate: data.map(item => (
                `Gene: ${item.gene.symbol}<br>` +
                `Dataset: ${item.dataset.name}<br>` +
                `Chromosome: ${item.chrLabel}<br>` +
                `-log10(p value): ${item.y.toFixed(2)}`
            ))
        });
        plotData.push({
            x: xRange,
            y: [-Math.log10(0.5), -Math.log10(0.5)],
            mode: 'lines',
            type: 'scattergl',
            line: {
                color: '#666666',
                width: 1
            },
            showlegend: false,
            hoverinfo: 'skip',
        });
        setTraces(plotData);
    }, []);

    return (
        <StyledManhattanPlot>
            <Plot
                divId={plotId}
                data={traces}
                layout={layout}
                config={config}
            />
            <div className='download-buttons'>
                <DownloadButton className='left' label='SVG' mode='svg' filename={title} plotId={plotId} />
                <DownloadButton label='PNG' mode='png' filename={title} plotId={plotId} />
            </div>
        </StyledManhattanPlot>
    );
};

export default ManhattanPlot;
