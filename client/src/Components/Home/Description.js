import React from 'react';
import styled from 'styled-components';

import doseImg from '../../images/desc-dosecurves.png';
import colors from '../../styles/colors';

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 70%;
    margin-top: 15vh;

    .text-container {
        width: 65%;

        display: flex;
        flex-direction: column;

        span {
            font-size: calc(0.5vw + 0.7em);
            line-height: calc(1vw + 1em);
        }

        h1 {
            color: ${colors.dark_teal_heading};
            font-family: 'Roboto Slab', serif;
            font-size: calc(2vw + 1em) !important;
            margin-bottom: 4vh;
        }
    }

    .dose-img {
        width: 30%;
        max-width: 400px;
    }
`;

/**
 * Shows the description on the home page
 * and the dose-response-curves graphic.
 *
 * @component
 * @example
 *
 * return (
 *   <Description/>
 * )
 */
const Description = () => {
    return (
        <StyledDescription>
            <div className="text-container">
                <h1>
                    Mine multiple cancer <br />
                    pharmacogenomic datasets.
                </h1>
                <span>
                    PharmacoDB allows scientists to search across publicly
                    available datasets to find instances where a drug or cell
                    line of interest has been profiled, and to view and compare
                    the dose-response data for a specific cell line - drug pair
                    from any of the studies included in the database.
                </span>
            </div>
            <img className="dose-img" src={doseImg} />
        </StyledDescription>
    );
};

export default Description;
