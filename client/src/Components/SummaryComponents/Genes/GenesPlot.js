import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCompoundTargetsQuery } from '../../../queries/gene';
import Plot from 'react-plotly.js';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import styled from 'styled-components';

const StyledGenePlot = styled.div`
    margin-top: 30px;
    margin-bottom: 30px;
`;

const layout = {
    autosize: true,
    height: 530,
    margin: {
      t: 50,
    },
    xaxis: {
        title: {
            text: 'Number of Targets'
        },
        tickvals: [ 10, 20, 30, 40, 50],
        ticktext: [ '10', '20', '30', '40', '50+'],
    },
    yaxis: {
        title: {
            text: 'Number of Compounds'
        },
        tickvals : [0, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000, 5000, 10000],
        ticktext : [0, 10, 20, 50, 100, 200, 500, '1k', 1500, '2k', '5k', '10k'],
        type: 'log'
    }
};

const config = {
    responsive: true,
    displayModeBar: false,
};

const GenesPlot = () => {

    const [plotData, setPlotData] = useState([]);
    const [error, setError] = useState(false);

    const parsePlotData = (data) => {
        let compoundTargets = data.map(item => ({
            compound_id: item.compound_id,
            numTargets: item.targets.length
        }));
        let targetNums = compoundTargets.map(item => item.numTargets);
        targetNums = [...new Set(targetNums)];
        let parsed = [];
        let fiftyAndMore = 0
        for(let targetNum of targetNums){
            let filtered = compoundTargets.filter(item => item.numTargets === targetNum);
            // combine 50 and more as a single bar
            if (targetNum >= 50) {
                fiftyAndMore += filtered.length;
            } else {
                parsed.push({
                    compoundNum: filtered.length,
                    targetNum: targetNum
                });
            }
        }
        parsed.sort((a, b) => b.compoundNum - a.compoundNum);
        parsed.push({compoundNum: fiftyAndMore, targetNum: 50});
        return({
            x: parsed.map(item => item.targetNum),
            y: parsed.map(item => item.compoundNum),
            type: 'bar',
            marker: {
                color: '#0868ac',
            },
        });
    }

    const { loading } = useQuery(getCompoundTargetsQuery, {
        variables: { compoundId: 0 },
        onCompleted: (data) => {
            setPlotData([parsePlotData(data.compound_targets)]);
        },
        onError: (err) => {
          console.log(err);
          setError(true);
        }
    });

    return(
        <StyledGenePlot>
            {
                loading ? <Loading />
                :
                error ? <Error />
                :
                <React.Fragment>
                    <h3>Frequency of Unique Targets per Compound</h3>
                    <Plot
                        data={plotData}
                        layout={layout}
                        config={config}
                    />
                </React.Fragment>

            }
        </StyledGenePlot>
    );
}

export default GenesPlot;
