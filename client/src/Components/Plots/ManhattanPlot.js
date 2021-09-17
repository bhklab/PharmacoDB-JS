import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import CustomSwitch from '../UtilComponents/CustomSwitch';
import DownloadButton from '../UtilComponents/DownloadButton';
import styled from 'styled-components';

const StyledManhattanPlot = styled.div`
    .header {
        width: 100%;
        margin-left: 10px;
        .title {
            font-size: 14px;
        }
        .switch-wrapper {
            display: flex;
            align-items: center;
            .disclaimer {
                margin-left: 10px;
                font-size: 10px;
                line-height: 1.5;
            }
        }
    }
    .download-buttons {
        display: flex;
        justify-content: flex-end;
        .left {
            margin-right: 5px;
        }
    }
`;

const ManhattanPlot = (props) => {
    const { title, data, biomarker, xRange, xLabelValues, plotId } = props;
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
                text: '-log10(FDR value)'
            },
            zeroline: false,
            range: [0, Math.max(...data.map(item => item.y)) + 0.5]
        },
        hovermode: "closest",
    };

    const config = {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    }

    const [traces, setTraces] = useState([]);
    const [highRes, setHighRes] = useState(false);

    useEffect(() => {
        let plotData = [];

        plotData.push({
            x: data.map(item => item.x),
            y: data.map(item => item.y),
            name: '',
            mode: 'markers',
            type: highRes ? 'scatter' : 'scattergl',
            marker: {
                color: data.map(item => item.color),
                size: data.map(item => item.y >= 1.5 ? 8 : item.y >= -Math.log10(0.5) ? 5 : 3),
                opacity: data.map(item => item.y < -Math.log10(0.5) ? 0.3 : 1),
                line: {
                    width: 0
                }
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
                `-log10(FDR value): ${item.y.toFixed(2)}`
            ))
        });

        plotData.push({
            x: xRange,
            y: [-Math.log10(0.5), -Math.log10(0.5)],
            mode: 'lines',
            type: highRes ? 'scatter' : 'scattergl',
            line: {
                color: '#666666',
                width: 1
            },
            showlegend: false,
            hoverinfo: 'skip',
        });

        if(biomarker.length){
            let pointLabels = [...new Set(biomarker.map(item => item.y))].map(item => {
                let datasetNames = biomarker.filter(p => p.y === item).map(p => p.dataset.name);
                return {
                    y: item,
                    datasets: datasetNames.join(', ')
                }
            });
            plotData.push({
                x: biomarker.map(item => item.x),
                y: biomarker.map(item => item.y),
                text: biomarker.map(item => `${item.gene.symbol}(${pointLabels.find(label => label.y === item.y).datasets})`),
                textposition: 'top',
                mode: 'markers+text',
                type: highRes ? 'scatter' : 'scattergl',
                marker: {
                    color: '#666666',
                    size: 8,
                    opacity: biomarker.map(item => item.y < -Math.log10(0.5) ? 0.3 : 1),
                    line: {
                        width: 0
                    }
                },
                showlegend: false,
                hoverlabel: {
                    bgcolor: '#666666',
                    font: {
                        size: 11
                    }
                },
                hovertemplate: biomarker.map(item => (
                    `Selected Biomarker: ${item.gene.symbol}<br>` +
                    `Dataset: ${item.dataset.name}<br>` +
                    `Chromosome: ${item.chrLabel}<br>` +
                    `-log10(FDR value): ${item.y.toFixed(2)}`
                ))
            });
        }
        setTraces(plotData);
    }, [highRes]);

    return (
        <StyledManhattanPlot>
            <div className='header'>
                <div className='title'>Plot Resolution</div>
                <div className='switch-wrapper'>
                    <CustomSwitch 
                        checked={highRes}
                        onChange={(checked) => {setHighRes(checked)}} 
                        labelLeft='Low'
                        labelRight='High'
                    />
                    <div className='disclaimer'>
                        Please allow up to 15 seconds to switch to high resolution due to re-rendering of large amount of data points. <br />
                        Please note that switching to high resolution adds strain to your web browser. 
                        It may significantly slow down plot rendering and other features such as hover-over legends and downloading plot image.
                    </div>
                </div>
            </div>
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
