/**
 * Functions used to process experiment data to render dose response curve.
 * Used in Tissue vs Compound and Cell Line vs Compound pages.
 */

import plotColors from "../styles/plot_colors";

const hill = (x, profile) => {
    return (profile.Einf + (100 - profile.Einf) / (1 + Math.pow(x / profile.EC50, profile.HS)));
}

//Returns the curve-fitting coordinates
const makeCurveFit = (profile, minDose, maxDose) => {
    //curve fitting data
    let numPoints = 301;
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
    color: color,
    highlight: color,
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
    color: color,
    highlight: color,
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

/**
 * Parses dose response curve data in plotly friendly format.
 * @param {*} experiments the parsed experiments 
 * @param {*} showScatter 
 * @returns 
 * traces: represents each line, contains all the information required for Plotly to render a plot.
 * xMin, xMax, yMin, yMax: min and max axis values detemrined by the experiment data.
 */
export const getDoseResponseCurveData = (experiments, showScatter) => {
    let traces = [];

    let doseResponses = experiments.map(item => item.dose_response);
    let doses = [];
    let responses = [];
    for(const doseResponse of doseResponses){
        doses = doses.concat(doseResponse.map(item => item.dose));
        responses = responses.concat(doseResponse.map(item => item.response));
    }
    let xMin = Math.min(...doses);
    let xMax = Math.max(...doses) + 2;
    let yMin = showScatter ? Math.min(...responses) - 5 : 0;
    let yMax = showScatter ? Math.max(...responses) + 2 : 100;

    for(const experiment of experiments){
        let curvCoordinates = makeCurveFit(experiment.profile, xMin, xMax);
        
        if(experiment.displayCurve){
            // invisible line used to display AAC
            traces.push({
                id: experiment.id,
                stat: 'AAC',
                color: experiment.color,
                highlight: experiment.highlight,
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
            traces.push({
                id: experiment.id,
                visible: experiment.visible,
                curve: true,
                stat: 'AAC',
                color: showScatter ? experiment.color : plotColors.default[2],
                highlight: experiment.highlight,
                x: curvCoordinates.map(item => Math.log10(item.x)),
                y: curvCoordinates.map(item => item.y),
                mode: 'lines',
                line: {
                    color: showScatter ? experiment.color : plotColors.default[2],
                    width: experiment.curveWidth ? experiment.curveWidth : 2,
                    // shape: 'spline'
                },
                showlegend: false,
                hoverinfo: 'none',
                fill: 'none',
            });
        }

        // Parse IC50 lines
        traces.push(getDashedLine(
            experiment.id,
            "IC50",
            [Math.log10(xMin), Math.log10(experiment.profile.IC50)],
            [50, 50],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));
        traces.push(getDashedLine(
            experiment.id,
            "IC50",
            [Math.log10(experiment.profile.IC50), Math.log10(experiment.profile.IC50)],
            [yMin, 50],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));
        traces.push(getScatterPoints(
            experiment.id,
            "IC50",
            [Math.log10(experiment.profile.IC50)],
            [50],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));

        // Parse EC50 lines
        traces.push(getDashedLine(
            experiment.id,
            "EC50",
            [Math.log10(xMin), Math.log10(experiment.profile.EC50)],
            [hill(experiment.profile.EC50, experiment.profile), hill(experiment.profile.EC50, experiment.profile)],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));
        traces.push(getDashedLine(
            experiment.id,
            "EC50",
            [Math.log10(experiment.profile.EC50), Math.log10(experiment.profile.EC50)],
            [yMin, hill(experiment.profile.EC50, experiment.profile)],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));
        traces.push(getScatterPoints(
            experiment.id,
            "EC50",
            [Math.log10(experiment.profile.EC50)],
            [hill(experiment.profile.EC50, experiment.profile)],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));

        // Parse Einf line
        traces.push(getDashedLine(
            experiment.id,
            "Einf",
            [Math.log10(xMin), Math.log10(xMax)],
            [experiment.profile.Einf, experiment.profile.Einf],
            experiment.highlight ? experiment.highlight : experiment.color,
            false
        ));
        
        if(showScatter){
            // Parse scatter points
            traces.push({
                id: experiment.id,
                name: experiment.experiment.name,
                stat: 'scatterPoints',
                x: experiment.dose_response.map(item => Math.log10(item.dose)),
                y: experiment.dose_response.map(item => item.response),
                mode: 'markers',
                type: 'scatter',
                marker: {
                    color: experiment.color
                },
                hoverinfo: 'text',
                hovertext: experiment.dose_response.map(item => (
                    `${experiment.experiment.name}<br />` + 
                    `Dose: ${item.dose.toFixed(5)}uM<br />` + 
                    `Response: ${item.response.toFixed(2)}%`
                )),
                fill: 'none',
                showlegend: false,
            });
        }
    }

    traces = traces.map((item, i) => ({...item, traceId: i}));

    return {
        traces: traces,
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    };
}
