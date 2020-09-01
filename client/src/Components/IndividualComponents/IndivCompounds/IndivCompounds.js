/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element, animateScroll as scroll } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../Utils/Layout';
import { getCompoundQuery } from '../../../queries/compound';
import { NotFoundContent } from '../../Utils/NotFoundPage';
import Table from '../../Utils/Table';

import { StyledIndivPage, StyledSidebar } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SYNONYM_COLUMNS = [
  {
    Header: 'Sources',
    accessor: 'sources',
  }, {
    Header: 'Names Used',
    accessor: 'name',
  },
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the compound API
 */
const formatTableData = (data) => {
  if (data) {
    return data.map((x) => ({
      name: x.name,
      sources: x.source.join(', '),
    }));
  }
};

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
  const [compound, setCompound] = useState({
    data: {},
    loaded: false,
  });

  // formatted data for synonyms annotation table
  const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
  const synonymData = React.useMemo(() => formatTableData(compound.data.synonyms), [compound.data.synonyms]);

  useEffect(() => {
    if (data !== undefined) {
      setCompound({
        data: data.compound,
        loaded: true,
      });
    }
  }, [data]);

  return (compound.loaded ? (
    <Layout page={compound.data.compound.name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-compounds">
                <h1>{compound.data.compound.name}</h1>
                <StyledSidebar>
                  <Link className="link" activeClass="selected" to="synonyms" spy smooth duration={200} offset={-400}>Synonyms</Link>
                  <Link className="link" activeClass="selected" to="external_ids" spy smooth duration={200} offset={-400}>External IDs</Link>
                  <Link className="link" activeClass="selected" to="plots" spy smooth duration={200} offset={-400}>Plots</Link>
                </StyledSidebar>
                <div className="container">
                  <div className="content">
                    <Element name="synonyms">
                      <h3>Synonyms</h3>
                      <Table columns={synonymColumns} data={synonymData} disablePagination />
                    </Element>
                    <Element name="external_ids" className="temp">External ids</Element>
                    <Element name="plots" className="temp">plots</Element>
                  </div>

                </div>
              </StyledIndivPage>
            ))}
      </StyledWrapper>
    </Layout>
  ) : null);
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
