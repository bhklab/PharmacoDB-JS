/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element, animateScroll as scroll } from 'react-scroll';
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
  .container {
    width: 100%;
    margin-top: 5vh;
    
    display:flex;
    align-items: flex-end;
    flex-direction: column;
    
    .content{
      width: 75%;
    }
  }
  .temp {
    width: 100%;
    height: 400px;
    background: ${colors.light_blue_bg};
    margin: 20px 0px;
  }

  // full size container when too small
  @media only screen and (max-width: 765px) {
    .content {
      width: 100% !important;
    }
  }

`;

const StyledSidebar = styled.div`
  width: calc(5vw + 4em);
  margin-top: 5vh;
  padding: 5px 0px;
  position:fixed;

  .link {
    display:block;
    color: ${colors.dark_teal_heading};
    border-right: 5px solid ${colors.light_blue_header};
    font-size: calc(0.4vw + 0.7em);
    font-family: 'Overpass', sans-serif;
    text-align: right;
    padding:20px 20px 20px 0px;
    transition: all 0.25s ease-out 0s;
    cursor: pointer;
  }
  .link:hover {
    color: ${colors.dark_pink_highlight};
    border-right: 5px solid ${colors.dark_pink_highlight};
    transition: all 0.25s ease-out 0s;
  }
  .selected {
    color: ${colors.dark_pink_highlight};
    border-right: 5px solid ${colors.dark_pink_highlight};
  }

  // hide sidebar when too small
  @media only screen and (max-width: 765px) {
    display:none;
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
                  <Link className="link" activeClass="selected" to="synonyms" spy smooth duration={200} offset={-400}>Synonyms</Link>
                  <Link className="link" activeClass="selected" to="external_ids" spy smooth duration={200} offset={-400}>External IDs</Link>
                  <Link className="link" activeClass="selected" to="plots" spy smooth duration={200} offset={-400}>Plots</Link>
                </StyledSidebar>
                <div className="container">
                  <div className="content">
                    <Element name="synonyms" className="temp">Synonyms</Element>
                    <Element name="external_ids" className="temp">External ids</Element>
                    <Element name="plots" className="temp">plots</Element>
                  </div>

                </div>
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
