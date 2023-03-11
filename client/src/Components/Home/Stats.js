import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import compoundsImg from '../../images/compound.webp';
import cellsImg from '../../images/cell.webp';
import datasetsImg from '../../images/dataset.webp';
import experimentsImg from '../../images/experiment.webp';
import genesImg from '../../images/gene.webp';
import tissuesImg from '../../images/tissue.webp';
import colors from '../../styles/colors';
import { getAllDataTypeStatsQuery } from '../../queries/stat';

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
 * TODO: Update the values in future if the stats gets updated; 
 * TODO: though the API updates this object but the data is not updated in case API call gives an error.
 */
const statsObject = {
  dataset: {
    name: 'datasets', value: '10', image: datasetsImg, link: '/datasets',
  },
  tissue: {
    name: 'tissues', value: '30', image: tissuesImg, link: '/tissues',
  },
  cell: {
    name: 'cell lines', value: '1,758', image: cellsImg, link: '/cell_lines',
  },
  experiment: {
    name: 'experiments',
    value: '6,314,313',
    image: experimentsImg,
    link: '/experiments',
  },
  gene: {
    name: 'genes', value: '61,211', image: genesImg, link: '/genes',
  },
  compound: {
    name: 'compounds', value: '56,149', image: compoundsImg, link: '/compounds',
  },
};


/**
 *
 * @param {Array} data - input array.
 */
const createStatsObject = (data) => {
  const stats = {};

  data.forEach(el => {
    stats[el.dataType] = el;
  })

  return stats;
}

/**
 *
 * @param {Array} data
 */
const updateStatsObject = (data) => {
  const stats = statsObject;

  Object.keys(stats).forEach((el) => {
    if (el !== 'gene') { //TODO: Update this when we can calculate the total number of genes.
      stats[el].value = data[el]['count'].toLocaleString();
    }
  })

  return stats;
}

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
const Stats = () => {
  const { loading, error, data } = useQuery(getAllDataTypeStatsQuery);
  const [stats, setStats] = useState(statsObject);

  useEffect(() => {
    if (data) {
      const stats = createStatsObject(data.data_type_stats);
      const updatedStatsObject = updateStatsObject(stats);

      setStats({...updatedStatsObject});
    }
  }, [data])

  return (
    < StyledStats >
      {
        Object.keys(stats).map((type) => (
          <div key={stats[type].name} className="item-container">
            <Link to={stats[type].link}>
              <img alt={stats[type].value} src={`${stats[type].image}`} />
              <div className="text">
                <span className="big">
                  {`${stats[type].value}`}
                </span>
                <br />
                {`${stats[type].name}`}
              </div>
            </Link>
          </div>
        ))
      }
    </StyledStats >
  )
};

export default Stats;
