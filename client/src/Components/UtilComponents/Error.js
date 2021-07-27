import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { XCircle } from 'react-bootstrap-icons';
import colors from '../../styles/colors';

/**
 * A component used to display error message.
 * The implementation examples can be found in the files in IndivDatasets/PlotSection, and IndivDatasets/Tables.
 */

const StyledError = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: Raleway, sans-serif;
    .stop-icon {
        font-size: clamp(32px, calc(20vw + 10px), 250px);
        color: ${colors.dark_pink_highlight};
        opacity: 0.6;
        margin-bottom: 30px;
    }
    h3 {
        color: ${colors.dark_pink_highlight};
        opacity: 0.8;
        font-family: Raleway, sans-serif;
    }
    p {
        font-size: clamp(12px, calc(1vw + 1px), 16px);
        font-family: Raleway, sans-serif;
    }
`;

const Error = (props) => {
    const { message } = props;
    return(
        <StyledError>
            <div className='stop-icon'>
                <XCircle />
            </div>
            <h3>An Error Occurred.</h3>
            {
                message && message.length > 0 &&
                <p>
                    { message }
                </p>
            }
        </StyledError>
    );
}

Error.propTypes = {
    message: PropTypes.string // an optional detailed error message.
};

export default Error;