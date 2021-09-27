import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getAllCompoundTargetsQuery } from '../../../queries/target';
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
        }

    },
    yaxis: {
        title: {
            text: 'Number of Compounds'
        }
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
        for (let targetNum of targetNums) {
            let filtered = compoundTargets.filter(item => item.numTargets === targetNum);
            parsed.push({
                compoundNum: filtered.length,
                targetNum: targetNum
            });
        }

        parsed.sort((a, b) => b.compoundNum - a.compoundNum);
        return ({
            x: parsed.map(item => item.targetNum),
            y: parsed.map(item => item.compoundNum),
            type: 'bar',
            marker: {
                color: '#0868ac',
            },
        });
    }

    const { loading } = useQuery(getAllCompoundTargetsQuery, {
        variables: { compoundId: 0 },
        onCompleted: (data) => {
            setPlotData([parsePlotData(data.all_compound_targets)]);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    return (
        <StyledGenePlot>
            {
                loading ? <Loading />
                    :
                    error ? <Error />
                        :
                        <React.Fragment>
                            <h3>Frequency of Unique Targets per Drug</h3>
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
