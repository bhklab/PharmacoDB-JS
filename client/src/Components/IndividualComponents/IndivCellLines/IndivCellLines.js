/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getCellLineQuery } from '../../../queries/cell';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import SnakeCase from '../../../utils/convertToSnakeCase';
import Table from '../../UtilComponents/Table';
import PlotSection from './PlotSection';

import { StyledIndivPage, StyledSidebar } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';
import TableSection from "./TableSection";

const SYNONYM_COLUMNS = [
  {
    Header: 'Sources',
    accessor: 'sources',
  }, {
    Header: 'Names Used',
    accessor: 'name',
  },
];

const SIDE_LINKS = ['Synonyms', 'Tissue Type', 'Disease(s)', 'Link(s)', 'Plots'];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the cell line API
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
 * Format data for the disease(s) - extract NCIT
 * @param {Array} data diseases data from the cell line API
 */
const formatDiseaseData = (data) => {
  if (data) {
    const ncit_path = 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI%20Thesaurus&code=';
    return data.map((x) => (x ? {
      key: x.split('; ')[1],
      name: x,
      source: ncit_path + x.split('; ')[1],
    } : {
      key: null,
      name: 'N/A',
      source: null,
    }));
  }
  return null;
};

/**
 * Format data for the link(s) - extract NCIT
 * @param {Array} data link data from the cell line API
 */
const formatLinkData = (data) => {
  if (data) {
    const cellosaurus_path = 'http://web.expasy.org/cellosaurus/';
    return data.map((x) => ({
      key: x,
      path: cellosaurus_path + x,
      source: 'Cellosaurus',
    }));
  }
  return null;
};

/**
 *
 * @param {String} link
 */
const createSideLink = (link) => <Link key={link} className="link" activeClass="selected" to={`${SnakeCase(link)}`} spy smooth duration={200} offset={-400}>{link}</Link>;

/**
 * Parent component for the individual cell line page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivCellLines/>
 * )
 */
const IndivCellLines = (props) => {
  // parameter.
  const { match: { params } } = props;

  // query to get the data for the single cell line.
  const { loading, error, data: queryData } = useQuery(getCellLineQuery, {
    variables: { cellId: parseInt(params.id) },
  });

  // load data from query into state
  const [cellLine, setCellLine] = useState({
    data: {},
    loaded: false,
  });

  // to set the state on the change of the data.
  useEffect(() => {
    if (queryData !== undefined) {
      setCellLine({
        data: queryData.cell_line,
        loaded: true,
      });
    }
  }, [queryData]);

  // destructuring the cellLine object.
  const { data } = cellLine;

  // formatted data for synonyms annotation table
  const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
  const synonymData = React.useMemo(() => formatSynonymData(data.synonyms), [data.synonyms]);
  const diseaseData = React.useMemo(() => formatDiseaseData(data.diseases), [data.diseases]);
  const linkData = React.useMemo(() => formatLinkData(data.accessions), [data.accessions]);
  return (cellLine.loaded ? (
    <Layout page={data.name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-cellLines">
                <h1>{data.name}</h1>
                <StyledSidebar>
                  {SIDE_LINKS.map((link) => createSideLink(link))}
                </StyledSidebar>
                <div className="container">
                  <div className="content">
                    <Element className="section" name="synonyms">
                      <h3>Synonyms</h3>
                      <Table columns={synonymColumns} data={synonymData} disablePagination />
                    </Element>
                    <Element className="section" name="tissue_type">
                      <h3>Tissue Type</h3>
                      <div className="text">{data.tissue.name}</div>
                    </Element>
                    <Element className="section" name="disease(s)">
                      <h3>Disease(s)</h3>
                      <div className="text">
                        {diseaseData ? diseaseData.map((x) => <a key={x.key} target="_blank" href={x.source}>{x.name}</a>) : 'N/A'}
                      </div>
                    </Element>
                    <Element className="section" name="link(s)">
                      <h3>Link(s)</h3>
                      <div className="text">
                        {linkData ? linkData.map((x) => <a key={x.key} target="_blank" href={x.path}>{x.source}</a>) : ''}
                      </div>
                    </Element>
                    <Element name="plots" className="section temp">
                      <h3>Plots</h3>
                      <PlotSection cellLine={({ id: data.id, name: data.name })} />
                      <h3>Drugs Summary</h3>
                      <TableSection cellLine={({ id: data.id, name: data.name })} />
                      <h3>Molecular Profiling</h3>
                      {/*<Table columns={molecularProfColumns} data={synonymData} disablePagination />*/}
                    </Element>
                  </div>
                </div>
              </StyledIndivPage>
            ))}
      </StyledWrapper>
    </Layout>
  ) : null);
};

IndivCellLines.propTypes = {
  /**
     * IndivCellLines' param id
     */
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndivCellLines;
