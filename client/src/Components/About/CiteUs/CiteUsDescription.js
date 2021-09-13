import React from 'react';
import styled from 'styled-components';

import colors from '../../../styles/colors';

const StyledDescription = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-height: 370px;
    text-align: justify;

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
 * Shows the description on cite us page
 *
 * @component
 * @example
 *
 * return (
 *   <Description/>
 * )
 */
const CiteUsDescription = () => (
  <StyledDescription>
    <div className="text-container">
      <h1>
        Cite Us:
      </h1>
      <span>
        We ask users who find our database of value to their research to cite us, using the following publications:<br/>
        <ul>
          <li>
            <a href="https://academic.oup.com/nar/article/46/D1/D994/4372597" target="_blank">
              Smirnov, Petr, et al. "PharmacoDB: an integrative database for mining in vitro anticancer drug screening
              studies." Nucleic Acids Research (2017).
            </a>
          </li>
            <li>
              <a href="https://academic.oup.com/bioinformatics/article/32/8/1244/1744214" target="_blank">
                Smirnov, Petr, et al. "PharmacoGx: an R package for analysis of large pharmacogenomic datasets."
                Bioinformatics 32.8 (2015): 1244-1246.
              </a>
          </li>
        </ul>
        We are always improving the quality of data in PharmacoDB. In order to ensure reproducibility of results use a
         <a href="https://zenodo.org/record/1027721#.YTIuMdNKj0o" target="_blank"> Zenodo DOI</a> to specify the version of the data used in your study (see all available DOIs below):
        <ul>
          <li>
            PharmacoDB-1.1.0 and PharmacoDB-1.0.0 share the same data (see Version 2 in Zenodo page) - <a href="https://zenodo.org/record/1038045" target="_blank">10.5281/zenodo.1038045</a>
          </li>
        </ul>
      </span>
    </div>
  </StyledDescription>
);

export default CiteUsDescription;
