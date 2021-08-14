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
      supportVec.push((minDose * Math.pow(dx,i)));
    }

    return(supportVec.map(item => ({
        x: item,
        y: hill(item, profile)
    })));
}

const DoseResponseCurve = (props) => {
    const { experiments, displayedStats } = props;
    const [traces, setTraces] = useState([]);

    useEffect(() => {
        let parsed = [];

        for(const experiment of experiments){
            let dose = experiment.dose_response.map(item => item.dose);
            let logDose = dose.map(item => Math.log10(item));
            let curvCoordinates = makeCurveFit(experiment.profile, Math.min(...dose), Math.max(...dose));
            
            parsed.push({
                name: experiment.name,
                x: [Math.min(...logDose), Math.max(...logDose)],
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
            
            parsed.push({
                name: experiment.name,
                curve: true,
                x: curvCoordinates.map(item => Math.log10(item.x)),
                y: curvCoordinates.map(item => item.y),
                mode: 'lines',
                line: {
                    color: experiment.color,
                    width: 1
                },
                showlegend: false,
                hoverinfo: 'skip',
                fill: 'none'
            });
            
            parsed.push({
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
                fill: 'none'
            });
        }
        setTraces(parsed);
    }, []);

    useEffect(() => {
        if(traces.length > 0){
            let copy = [...traces];
            copy = copy.filter(trace => !trace.additionalStat);
            copy = copy.map(trace => ({...trace, fill: 'none'}));
            for(const stat of displayedStats){
                switch(stat.statName){
                    case 'AAC':
                        let index = copy.findIndex(item => item.name === stat.rowName && item.curve);
                        copy[index].fill = 'tonexty';
                        break;
                    case 'IC50':
                        break;
                    case 'Einf':
                        break;
                    case 'DSS1':
                        break;
                    default:
                        break;
                }
            }
            setTraces(copy);
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
            }} 
            config={{
                responsive: true,
                displayModeBar: false,
            }} 
        />
    );
}

export default DoseResponseCurve;