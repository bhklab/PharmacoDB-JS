import React from 'react';
import styled from 'styled-components';

import colors from '../../../styles/colors';

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height: 370px;

    width: 70%;
    margin-top: 8vh;

    .text-container {
        width: 100%;

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

    /* mobile */
    @media only screen and (max-width: 1081px) {
        .text-container{
          width:100%;
        }
    } 
`;

/**
 * Shows the description on documentation page
 *
 * @component
 * @example
 *
 * return (
 *   <DocDescription/>
 * )
 */
const DocDescription = () => (
  <StyledDescription>
    <div className="text-container">
      <h1>
        Documentations:
      </h1>
      <span>
        Under construction ...
      </span>
    </div>
  </StyledDescription>
);

export default DocDescription;
