/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Layout from '../Layout/Layout';
import { getCompoundQuery } from '../../queries/queries';
import colors from '../../styles/colors';

import StyledWrapper from '../../styles/IndivPageStyles';

const StyledIndivCompounds = styled.div`
  h1 {
    color: ${colors.dark_teal_heading};
    font-family: 'Roboto Slab', serif;
    font-size: calc(2vw + 1.5em);
  }

`;

const StyledSidebar = styled.div`
  width: calc(5vw + 5em);
  margin-top: 5vh;
  padding: 5px 0px;

  a {
    display:block;
    color: ${colors.dark_teal_heading};
    border-right: 5px solid ${colors.light_blue_header};
    font-size: calc(0.4vw + 0.7em);
    font-family: 'Overpass', sans-serif;
    text-align: right;
    padding:20px 20px 20px 0px;
  }
  a:hover {
    color: ${colors.dark_pink_highlight};
    border-right: 5px solid ${colors.dark_pink_highlight};
  }
  .active {
    border-right: 5px solid ${colors.dark_pink_highlight};
  }

`;

/**
 * Parent component for the individual compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Compounds/>
 * )
 */
const IndivCompounds = (props) => {
  const { match: { params } } = props;

  // query
  const { loading, error, data } = useQuery(getCompoundQuery, {
    variables: { compoundId: parseInt(params.id) },
  });
  // load data from query into state
  const [compound, setCompound] = useState({});
  useEffect(() => {
    if (data !== undefined) {
      setCompound(data.compound);
    }
  }, [data]);

  return (
    <Layout>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<p>Error!</p>)
            : (
              <StyledIndivCompounds>
                <h1>{compound.name}</h1>
                <StyledSidebar>
                  <Link to="#synonyms">Synonyms</Link>
                  <Link to="#external_ids">External IDs</Link>
                  <Link to="#plots">Plots</Link>
                </StyledSidebar>
                <div id="synonyms" />
              </StyledIndivCompounds>
            ))}
      </StyledWrapper>
    </Layout>
  );
};

IndivCompounds.propTypes = {
  /**
   * IndivCompounds' param id
  */
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

IndivCompounds.defaultProps = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: '1',
    }),
  }),
};

export default IndivCompounds;
