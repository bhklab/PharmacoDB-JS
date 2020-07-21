import React from 'react';
import styled from 'styled-components';

import compoundsImg from '../../images/compounds.png';
import cellsImg from '../../images/cells.png';
import datasetsImg from '../../images/datasets.png';
import experimentsImg from '../../images/experiments.png';
import genesImg from '../../images/genes.png';
import tissuesImg from '../../images/tissues.png';
import colors from '../../styles/colors';

const StyledStats = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    width: 80%;
    margin-bottom: 20vh; //TODO: REMOVE
    margin-top: 8vh;
    background: ${colors.light_blue_bg};
    height: 12vw;
    border-radius: calc(0.8vw + 0.4em);

    .item-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
            width: calc(3.8vw + 30px);
            margin-bottom: 1vw;
        }
        .text {
            color: ${colors.dark_teal_heading};
            font-size: calc(0.8vw + 0.3em);
            text-align: center;
            font-family: 'Rubik', sans-serif;
            font-weight: 400;
            line-height: calc(0.8vw + 0.5em);
        }
        .big {
            font-size: calc(0.9vw + 0.5em);
        }
    }

    /* mobile */
    @media only screen and (max-width: 1081px) {
      flex-wrap: wrap;
      border-radius: calc(1vw + 0.5em);
      height: auto;
      
      .item-container {
        flex-basis: 33.333333%;
        padding: 10px 0;

        img {
          width: calc(3vw + 20px);
        }

        .text {
          font-size: calc(0.8vw + 0.5em);
          line-height: calc(0.8vw + 0.8em);
        }

        .big {
          font-size: calc(0.9vw + 0.7em);
        }
      }
    } 
`;

/**
 * @returns {Object} - returns an Object of different types with name and value.
 */
const statistics = {
  datasets: { name: 'datasets', value: '7', image: datasetsImg },
  tissues: { name: 'tissues', value: '41', image: tissuesImg },
  cells: { name: 'cell-lines', value: '1,691', image: cellsImg },
  experiments: {
    name: 'experiments',
    value: '650,894',
    image: experimentsImg,
  },
  genes: { name: 'genes', value: '19,933', image: genesImg },
  compounds: { name: 'compounds', value: '759', image: compoundsImg },
};

/**
 * Shows the stats with graphics on the front page.
 *
 * @component
 * @example
 *
 * return (
 *   <Stats/>
 * )
 */
const Stats = () => (
  <StyledStats>
    {Object.keys(statistics).map((type) => (
      <div key={statistics[type].name} className="item-container">
        <img alt={statistics[type].value} src={`${statistics[type].image}`} />
        <div className="text">
          <span className="big">
            {`${statistics[type].value}`}
          </span>
          <br />
          {`${statistics[type].name}`}
        </div>
      </div>
    ))}
  </StyledStats>
);

export default Stats;
