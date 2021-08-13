import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import d3 from 'd3';

function getSupportVec(x, num_points) {
    var dx = Math.pow(10,((Math.log10(d3.max(x)) - Math.log10(d3.min(x)))/(num_points - 1)));
    var support_vec = [];
    for (var i=0; i < num_points; i++){
      support_vec.push((d3.min(x) * Math.pow(dx,i)));
    }
    return support_vec;
}
  
function hill(x, pars) {
    return (pars[1] + (100 - pars[1]) / (1 + Math.pow(x / pars[2], pars[0])));
}

//Returns the curve-fitting coordinates
function makeCurveFit(pars, minDose, maxDose) {
    //curve fitting data
    var x = getSupportVec([minDose, maxDose], 1001);
    var y = [];
  
    for (var i = 0; i < x.length; i++) {
      y.push(hill(x[i], pars));
    }
  
    //making into a JSON object to send to curvefit
    var coords = [];
    for (var i = 0; i < x.length; i++) {
      var obj = {}
      obj["x"] = x[i];
      obj["y"] = y[i];
      coords.push(obj);
    }
    return coords;
}

const DoseResponseCurve = (props) => {
    const { experiments, displayedStats } = props;
    const [traces, setTraces] = useState([]);

    useEffect(() => {
        let parsed = [];
        for(const experiment of experiments){
            let dose = experiment.dose_response.map(item => item.dose);
            let profile = [experiment.profile.HS, experiment.profile.Einf, experiment.profile.EC50];
            let curvCoordinates = makeCurveFit(profile, Math.min(...dose), Math.max(...dose));

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
                fill: ''
            });
            
            parsed.push({
                name: experiment.name,
                x: dose.map(item => Math.log10(item)),
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
                fill: ''
            });
        }
        setTraces(parsed);
    }, []);

    useEffect(() => {
        if(traces.length > 0){
            let copy = [...traces];
            copy = copy.filter(trace => !trace.additionalStat);
            copy = copy.map(trace => ({...trace, fill: ''}));
            for(const stat of displayedStats){
                switch(stat.statName){
                    case 'AAC':
                        let index = copy.findIndex(item => item.name === stat.rowName && item.curve);
                        copy[index].fill = 'tozeroy';
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