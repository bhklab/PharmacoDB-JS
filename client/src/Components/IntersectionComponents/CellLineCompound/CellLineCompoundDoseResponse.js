/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import plotColors from '../../../styles/plot_colors';

// const hill = (x, profile) => {
//     return ((profile.Einf * 100) + (100 - (profile.Einf * 100)) / (1 + Math.pow(x / Math.pow(profile.EC50), profile.HS)));
// }

// [data.data[i].params.HS, data.data[i].params.Einf*100, Math.pow(10,data.data[i].params.EC50)]
// function hill(x, pars) {
//     return (pars[1] + (100 - pars[1]) / (1 + Math.pow(x / pars[2], pars[0])));
// }

const CellLineCompoundDoseResponse = (props) => {
    const { experiments, displayedStats } = props;
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        let data = experiments.map((item, i) => ({
            name: item.dataset.name,
            dose_response: item.dose_response,
            profile: item.profile,
            color: plotColors[i]
        }));
        setData(data);
        setReady(true);
    }, []);

    return(
        <React.Fragment>
            {
                ready && 
                <DoseResponseCurve 
                    experiments={data}
                    displayedStats={displayedStats} 
                />
            }
        </React.Fragment>
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