import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
  
const hill = (x, profile) => {
    return (profile.Einf + (100 - profile.Einf) / (1 + Math.pow(x / profile.EC50, profile.HS)));
}

//Returns the curve-fitting coordinates
const makeCurveFit = (profile, minDose, maxDose) => {
    //curve fitting data
    let numPoints = 1001;
    let dx = Math.pow(10,((Math.log10(maxDose) - Math.log10(minDose))/(numPoints - 1)));
    let supportVec = [];
    for(let i = 0; i < numPoints; i++){
      supportVec.push((minDose * Math.pow(dx, i)));
    }

    return(supportVec.map(item => ({
        x: item,
        y: hill(item, profile)
    })));
}

const getDashedLine = (id, stat, x, y, color) => ({
    id: id,
    stat: stat,
    additionalStat: true,
    x: x,
    y: y,
    mode: 'lines',
    line: {
        color: color,
        width: 3,
        dash: 'dot'
    },
    showlegend: false,
    hoverinfo: 'skip',
    fill: 'none',
    visible: false
});

const getScatterPoints = (id, stat, x, y, color) => ({
    id: id,
    stat: stat,
    additionalStat: true,
    x: x,
    y: y,
    mode: 'markers',
    type: 'scatter',
    marker: {
        color: color,
        size: 8
    },
    showlegend: false,
    hoverinfo: 'skip',
    visible: false
});

const parseDoseResponseData = (experiments, xMin, xMax) => {
    let parsed = [];
    for(const experiment of experiments){
        let dose = experiment.dose_response.map(item => item.dose);
        let logDose = dose.map(item => Math.log10(item));
        let curvCoordinates = makeCurveFit(experiment.profile, xMin, xMax);
        
        // invisible line used to display AAC
        parsed.push({
            id: experiment.id,
            stat: 'AAC',
            x: [Math.log10(xMin), Math.log10(xMax)],
            y: [100, 100],
            mode: 'lines',
            line: {
                color: experiment.color,
                width: 0
            },
            showlegend: false,
            hoverinfo: 'skip',
            fill: 'none'
        });
        
        // Parse dose response curve
        parsed.push({
            id: experiment.id,
            curve: true,
            x: curvCoordinates.map(item => Math.log10(item.x)),
            y: curvCoordinates.map(item => item.y),
            mode: 'lines',
            line: {
                color: experiment.color,
                width: 2
            },
            showlegend: false,
            hoverinfo: 'skip',
            fill: 'none'
        });
        
        // Parse scatter points
        parsed.push({
            id: experiment.id,
            name: experiment.name,
            x: logDose,
            y: experiment.dose_response.map(item => item.response),
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: experiment.color
            },
            hoverinfo: 'text',
            hovertext: experiment.dose_response.map(item => (
                `${experiment.name}<br />` + 
                `Dose: ${item.dose}uM<br />` + 
                `Response: ${item.response}%`
            )),
            fill: 'none',
            showlegend: false,
        });

        // Parse IC50 lines
        parsed.push(getDashedLine(
            experiment.id,
            "IC50",
            [Math.log10(xMin), Math.log10(experiment.profile.IC50)],
            [50, 50],
            experiment.color
        ));
        parsed.push(getDashedLine(
            experiment.id,
            "IC50",
            [Math.log10(experiment.profile.IC50), Math.log10(experiment.profile.IC50)],
            [0, 50],
            experiment.color
        ));
        parsed.push(getScatterPoints(
            experiment.id,
            "IC50",
            [Math.log10(experiment.profile.IC50)],
            [50],
            experiment.color
        ));

        // Parse EC50 lines
        parsed.push(getDashedLine(
            experiment.id,
            "EC50",
            [Math.log10(xMin), Math.log10(experiment.profile.EC50)],
            [hill(experiment.profile.EC50, experiment.profile), hill(experiment.profile.EC50, experiment.profile)],
            experiment.color
        ));
        parsed.push(getDashedLine(
            experiment.id,
            "EC50",
            [Math.log10(experiment.profile.EC50), Math.log10(experiment.profile.EC50)],
            [0, hill(experiment.profile.EC50, experiment.profile)],
            experiment.color
        ));
        parsed.push(getScatterPoints(
            experiment.id,
            "EC50",
            [Math.log10(experiment.profile.EC50)],
            [hill(experiment.profile.EC50, experiment.profile)],
            experiment.color
        ));

        // Parse Einf line
        parsed.push(getDashedLine(
            experiment.id,
            "Einf",
            [Math.log10(xMin), Math.log10(xMax)],
            [experiment.profile.Einf, experiment.profile.Einf],
            experiment.color
        ));

    }
    return parsed;
}

const alterStats = (traces, displayedStats) => {
    traces = traces.map(trace => ({...trace, fill: 'none'}));
    traces.forEach(trace => {
        if(trace.additionalStat){
            trace.visible = false;
        }
    });
    for(const stat of displayedStats){
        let index = -1;
        switch(stat.statName){
            case 'AAC':
                index = traces.findIndex(item => item.id === stat.id && item.curve);
                traces[index].fill = 'tonexty';
                break;
            case 'IC50':
                traces.forEach(trace => {
                    if(trace.id === stat.id && trace.stat === stat.statName){
                        trace.visible = true;
                    }
                });
                break;
            case 'EC50':
                traces.forEach(trace => {
                    if(trace.id === stat.id && trace.stat === stat.statName){
                        trace.visible = true;
                    }
                });
                break;
            case 'Einf':
                traces.forEach(trace => {
                    if(trace.id === stat.id && trace.stat === stat.statName){
                        trace.visible = true;
                    }
                });
                break;
            case 'DSS1':
                break;
            default:
                break;
        }
    }
    return traces;
}

const DoseResponseCurve = (props) => {
    const { experiments, displayedStats } = props;
    const [traces, setTraces] = useState([]);
    const [plotValues, setPlotValues] = useState({
        xMin: 0,
        xMax: 0,
    })

    useEffect(() => {
        let doseResponses = experiments.map(item => item.dose_response);
        let doses = [];
        for(const doseResponse of doseResponses){
            doses = doses.concat(doseResponse.map(item => item.dose));
        }
        let xMin = Math.min(...doses);
        let xMax = Math.max(...doses);
        setPlotValues(
            {
                xMin: xMin,
                xMax: xMax
            }
        );
        let parsed = parseDoseResponseData(experiments, xMin, xMax);
        setTraces(parsed);
    }, []);

    useEffect(() => {
        if(traces.length > 0){
            let updatedTraces = alterStats([...traces], displayedStats);
            setTraces(updatedTraces);
        }
    }, [displayedStats]);

    return(
        <Plot 
            data={traces} 
            layout={{
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
                    showline: true,
                    fixedrange: true,
                    range: [Math.log10(plotValues.xMin), Math.log10(plotValues.xMax)]
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
                    range: [0, 120]
                }
            }} 
            config={{
                responsive: true,
                displayModeBar: false,
            }} 
        />
    );
}

export default DoseResponseCurve;