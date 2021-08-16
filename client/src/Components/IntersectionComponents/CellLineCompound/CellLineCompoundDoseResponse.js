/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import styled from 'styled-components';

const StyledDoseResponseContainer = styled.div`
    display: flex;
`;
 
const CellLineCompoundDoseResponse = (props) => {
    const { experiments, displayedStats } = props;
    const [data, setData] = useState([]);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        let data = experiments.map((item, i) => ({
            id: item.id,
            name: item.dataset.name,
            dose_response: item.dose_response,
            profile: item.profile,
            color: item.color
        }));
        setData(data);
        setReady(true);
    }, []);

    return(
        <StyledDoseResponseContainer>
            {
                ready && 
                <DoseResponseCurve 
                    experiments={data}
                    displayedStats={displayedStats} 
                />
            }
        </StyledDoseResponseContainer>
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