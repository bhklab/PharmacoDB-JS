/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';

const CellLineCompoundDoseResponse = (props) => {
    const { experiments } = props;
    const [data, setData] = useState([]);
    useEffect(() => {
        let parsed = [];
        for(const experiment of experiments){
            parsed.push({
                x: experiment.dose_response.map(item => Math.log10(item.dose)),
                y: experiment.dose_response.map(item => item.response),
                mode: 'markers',
                type: 'scatter',
                name: experiment.dataset.name,
                hoverinfo: 'text',
                hovertext: experiment.dose_response.map(item => `Dose: ${item.dose}uM<br />` + `Response: ${item.response}%`)
            });
        }
        setData(parsed);
    }, []);

    return(
        <DoseResponseCurve data={data} />
    );
};

CellLineCompoundDoseResponse.propTypes = {
    experiments: PropTypes.arrayOf(
        PropTypes.shape({
            dataset: PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string
            }),
            dose_response: PropTypes.arrayOf(
                PropTypes.shape(
                    {
                        dose: PropTypes.number,
                        response: PropTypes.number
                    }
                )
            )
        })
    )   
};

export default CellLineCompoundDoseResponse;