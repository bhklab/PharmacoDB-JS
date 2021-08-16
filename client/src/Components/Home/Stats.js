import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  datasets: {
    name: 'datasets', value: '8', image: datasetsImg, link: '/datasets',
  },
  tissues: {
    name: 'tissues', value: '30', image: tissuesImg, link: '/tissues',
  },
  cells: {
    name: 'cell-lines', value: '1,676', image: cellsImg, link: '/cell_lines',
  },
  experiments: {
    name: 'experiments',
    value: '102,9712',
    image: experimentsImg,
    link: '/experiments',
  },
  genes: {
    name: 'genes', value: '60,859', image: genesImg, link: '/genes',
  },
  compounds: {
    name: 'compounds', value: '920', image: compoundsImg, link: '/compounds',
  },
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
        <Link to={statistics[type].link}>
          <img alt={statistics[type].value} src={`${statistics[type].image}`} />
          <div className="text">
            <span className="big">
              {`${statistics[type].value}`}
            </span>
            <br />
            {`${statistics[type].name}`}
          </div>
        </Link>
      </div>
    ))}
  </StyledStats>
);

export default Stats;
