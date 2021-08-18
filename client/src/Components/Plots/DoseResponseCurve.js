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

const getDashedLine = (id, stat, x, y, color, visible) => ({
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
    visible: visible
});

const getScatterPoints = (id, stat, x, y, color, visible) => ({
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
    visible: visible
});

const parseDoseResponseData = (experiments, xMin, xMax, yMin) => {
    let parsed = [];
    for(const experiment of experiments){
        let curvCoordinates = makeCurveFit(experiment.profile, xMin, xMax);
        
        if(experiment.visible){
            
            if(experiment.displayCurve){
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
                    fill: experiment.visibleStats.AAC.visible ? 'tonexty' : 'none'
                });
            }

            // Parse IC50 lines
            parsed.push(getDashedLine(
                experiment.id,
                "IC50",
                [Math.log10(xMin), Math.log10(experiment.profile.IC50)],
                [50, 50],
                experiment.color,
                experiment.visibleStats.IC50.visible
            ));
            parsed.push(getDashedLine(
                experiment.id,
                "IC50",
                [Math.log10(experiment.profile.IC50), Math.log10(experiment.profile.IC50)],
                [yMin, 50],
                experiment.color,
                experiment.visibleStats.IC50.visible
            ));
            parsed.push(getScatterPoints(
                experiment.id,
                "IC50",
                [Math.log10(experiment.profile.IC50)],
                [50],
                experiment.color,
                experiment.visibleStats.IC50.visible
            ));

            // Parse EC50 lines
            parsed.push(getDashedLine(
                experiment.id,
                "EC50",
                [Math.log10(xMin), Math.log10(experiment.profile.EC50)],
                [hill(experiment.profile.EC50, experiment.profile), hill(experiment.profile.EC50, experiment.profile)],
                experiment.color,
                experiment.visibleStats.EC50.visible
            ));
            parsed.push(getDashedLine(
                experiment.id,
                "EC50",
                [Math.log10(experiment.profile.EC50), Math.log10(experiment.profile.EC50)],
                [yMin, hill(experiment.profile.EC50, experiment.profile)],
                experiment.color,
                experiment.visibleStats.EC50.visible
            ));
            parsed.push(getScatterPoints(
                experiment.id,
                "EC50",
                [Math.log10(experiment.profile.EC50)],
                [hill(experiment.profile.EC50, experiment.profile)],
                experiment.color,
                experiment.visibleStats.EC50.visible
            ));

            // Parse Einf line
            parsed.push(getDashedLine(
                experiment.id,
                "Einf",
                [Math.log10(xMin), Math.log10(xMax)],
                [experiment.profile.Einf, experiment.profile.Einf],
                experiment.color,
                experiment.visibleStats.Einf.visible
            ));
        }
        
        // Parse scatter points
        parsed.push({
            id: experiment.id,
            name: experiment.name,
            x: experiment.dose_response.map(item => Math.log10(item.dose)),
            y: experiment.dose_response.map(item => item.response),
            mode: 'markers',
            type: 'scatter',
            marker: {
                color: experiment.color
            },
            hoverinfo: 'text',
            hovertext: experiment.dose_response.map(item => (
                `${experiment.name}<br />` + 
                `Dose: ${item.dose.toFixed(5)}uM<br />` + 
                `Response: ${item.response.toFixed(2)}%`
            )),
            fill: 'none',
            showlegend: false,
        });
    }
    return parsed;
}

const DoseResponseCurve = (props) => {
    const { experiments, plotId } = props;
    const [traces, setTraces] = useState([]);
    const [plotValues, setPlotValues] = useState({
        xMin: 0,
        xMax: 0,
    });

    useEffect(() => {
        setTraces([]); // Reset traces each time experiments are modified to redraw the plot
        let doseResponses = experiments.map(item => item.dose_response);
        let doses = [];
        let responses = [];
        for(const doseResponse of doseResponses){
            doses = doses.concat(doseResponse.map(item => item.dose));
            responses = responses.concat(doseResponse.map(item => item.response));
        }
        let xMin = Math.min(...doses);
        let xMax = Math.max(...doses) + 2;
        let yMin = Math.min(...responses) - 2;
        setPlotValues(
            {
                xMin: xMin,
                xMax: xMax,
                yMax: Math.max(...responses) + 2,
                yMin: yMin
            }
        );
        let parsed = parseDoseResponseData(experiments, xMin, xMax, yMin);
        setTraces(parsed);
    }, [experiments]);

    return(
        <Plot 
            divId={plotId}
            data={traces} 
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
                    range: [plotValues.yMin, plotValues.yMax]
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