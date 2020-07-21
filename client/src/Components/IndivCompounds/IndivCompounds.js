/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element, animateScroll as scroll } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../Layout/Layout';
import { getCompoundQuery } from '../../queries/queries';

import { StyledWrapper, StyledIndivPage, StyledSidebar } from '../../styles/IndivPageStyles';

/**
 * Parent component for the individual compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivCompounds/>
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
      setCompound(data.compound.compound);
    }
  }, [data]);

  return (
    <Layout>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<p>Error!</p>)
            : (
              <StyledIndivPage>
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
              </StyledIndivPage>
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
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndivCompounds;
