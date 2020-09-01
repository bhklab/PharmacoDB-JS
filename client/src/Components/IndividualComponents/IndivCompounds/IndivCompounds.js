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

const ANNOTATION_COLUMNS = [
  {
    Header: 'Database',
    accessor: 'db',
  }, {
    Header: 'Identifier',
    accessor: 'identifier',
  },
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the compound API
 */
const formatSynonymData = (data) => {
  if (data) {
    return data.map((x) => ({
      name: x.name,
      sources: x.source.join(', '),
    }));
  }
};

/**
 * Format data for the external ids annotation table
 * @param {Array} data annotation data from the compound API
 */
const formatAnnotationData = (data) => {
  if (data) {
    const { annotation } = data;
    return [
      {
        db: 'SMILES',
        identifier: annotation.smiles,
      }, {
        db: 'InChiKey',
        identifier: annotation.inchikey,
      }, {
        db: 'PubChem ID',
        identifier: annotation.pubchem,
      },
    ];
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
  const synonymData = React.useMemo(() => formatSynonymData(compound.data.synonyms), [compound.data.synonyms]);

  // formatted data for external ids annotation table
  const annotationColumns = React.useMemo(() => ANNOTATION_COLUMNS, []);
  const annotationData = React.useMemo(() => formatAnnotationData(compound.data.compound), [compound.data.compound]);

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
                    <Element name="external_ids">
                      <h3>External IDs</h3>
                      <Table columns={annotationColumns} data={annotationData} disablePagination />
                    </Element>
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
