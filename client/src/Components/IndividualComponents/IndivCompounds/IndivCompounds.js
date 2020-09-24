/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../Utils/Layout';
import { getCompoundQuery } from '../../../queries/compound';
import { NotFoundContent } from '../../Utils/NotFoundPage';
import SnakeCase from '../../Utils/SnakeCase';
import Table from '../../Utils/Table';
import PlotSection from './PlotSection';

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

const SIDE_LINKS = ['Synonyms', 'External IDs', 'Annotated Targets', 'FDA Approval Status', 'Plots'];

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
  return null;
};

/**
 * Format data for the external ids annotation table
 * @param {Array} data annotation data from the compound API
 */
const formatAnnotationData = (data) => {
  const modifiedData = [];
  if (data) {
    const { annotation } = data;
    modifiedData.push({
      db: 'SMILES',
      identifier: annotation.smiles,
    }, {
      db: 'InChiKey',
      identifier: annotation.inchikey,
    }, {
      db: 'PubChem ID',
      identifier: annotation.pubchem,
    });
  }
  return modifiedData;
};

/**
 *
 * @param {String} link
 */
const createSideLink = (link) => <Link key={link} className="link" activeClass="selected" to={`${SnakeCase(link)}`} spy smooth duration={200} offset={-400}>{link}</Link>;

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
  // parameter.
  const { match: { params } } = props;
  // const compoundId = parseInt(params.id);

  // query to get the data for the single compound.
  const { loading, error, data: queryData } = useQuery(getCompoundQuery, {
    variables: { compoundId: parseInt(params.id) },
  });

  // load data from query into state
  const [compound, setCompound] = useState({
    data: {},
    loaded: false,
  });

  // to set the state on the change of the data.
  useEffect(() => {
    if (queryData !== undefined) {
      setCompound({
        data: queryData.singleCompound,
        loaded: true,
      });
    }
  }, [queryData]);

  // destructuring the compound object.
  const { data } = compound;

  // formatted data for synonyms annotation table
  const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
  const synonymData = React.useMemo(() => formatSynonymData(data.synonyms), [data.synonyms]);

  // formatted data for external ids annotation table
  const annotationColumns = React.useMemo(() => ANNOTATION_COLUMNS, []);
  const annotationData = React.useMemo(() => formatAnnotationData(data.compound), [data.compound]);

  return (compound.loaded ? (
    <Layout page={data.compound.name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-compounds">
                <h1>{data.compound.name}</h1>
                <StyledSidebar>
                  {
                    SIDE_LINKS.map((link) => createSideLink(link))
                  }
                </StyledSidebar>
                <div className="container">
                  <div className="content">
                    <Element className="section" name="synonyms">
                      <h3>Synonyms</h3>
                      <Table columns={synonymColumns} data={synonymData} disablePagination />
                    </Element>
                    <Element className="section" name="external_ids">
                      <h3>External IDs</h3>
                      <Table columns={annotationColumns} data={annotationData} disablePagination />
                    </Element>
                    <Element className="section" name="annotated_targets">
                      <h3>Annotated Targets</h3>
                      <div className="text">{data.targets ? data.targets.map((x) => x.name).join(', ') : ''}</div>
                    </Element>
                    <Element className="section" name="fda_approval_status">
                      <h3>FDA Approval Status</h3>
                      <div className="text">{data.compound.annotation.fda_status}</div>
                    </Element>
                    <Element name="plots" className="section temp">
                      <h3>Plots</h3>
                      <PlotSection compound={({ id: data.compound.id, name: data.compound.name })} />
                    </Element>
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
