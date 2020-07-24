import React from 'react';
import styled from 'styled-components';

import doseImg from '../../images/desc-dosecurves.png';
import colors from '../../styles/colors';

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height:370px;

    width: 70%;
    margin-top: 8vh;

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
            font-size: calc(1.8vw + 1em) !important;
            margin-bottom: 4vh;
        }
    }

    .dose-img {
        width: 25%;
        max-width: 370px;
    }

    /* mobile */
    @media only screen and (max-width: 1081px) {
        .dose-img {
            display: none;
        }
        .text-container{
          width:100%;
        }
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
const Description = () => (
  <StyledDescription>
    <div className="text-container">
      <h1>
        Mine multiple cancer
        {' '}
        <br />
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
    <img alt="dose-response curves" className="dose-img" src={doseImg} />
  </StyledDescription>
);

export default Description;
