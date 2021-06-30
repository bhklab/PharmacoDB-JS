/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import SnakeCase from '../../../utils/convertToSnakeCase';
import datasets from './datasets';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';

import { StyledIndivPage, StyledSidebar } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';
import { getDatasetQuery } from '../../../queries/dataset';

const SIDE_LINKS = ['Acronym', 'Description', 'Resources', 'Publications', 'Data type', 'PharmacoGx', 'Plots'];

const DATATYPE_COLUMNS = [
  {
    Header: () => <div style={{ textAlign: 'left' }}>Data Type</div>,
    accessor: 'type',
  }, {
    Header: <div style={{ textAlign: 'left' }}>Assay/Platform</div>,
    accessor: 'platform',
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Raw</div>,
    accessor: 'raw',
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Processed</div>,
    accessor: 'processed',
  },
];

/**
 *
 * @param {String} link
 */
const createSideLink = (link) => <Link key={link} className="link" activeClass="selected" to={`${SnakeCase(link)}`} spy smooth duration={200} offset={-400}>{link}</Link>;

/**
 * Format data for the resources section
 * @param {Array} resource  from dataset json file
 */
const formatResouceData = (resource) => resource.map((x, index) => ((
  <a key={index} href={x.urlextern} target="_blank">
    {x.name}
    {' '}
    <br />
    <br />
  </a>
)));

/**
 * Format data for the resources section
 * @param {Array} resource  from dataset json file
 */
const formatPublicationData = (resource) => resource.map((x, index) => ((
  <a key={index} href={x.url} target="_blank">
    {x.title}
    {' '}
    <br />
    <br />
  </a>
)));
/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the compound API
 */
const formatDataType = (data) => {
  if (data) {
    return data.map((x) => ({
      type: x.type,
      platform: x.platform,
      raw: x.raw,
      processed: x.processed.join(', '),
    }));
  }
  return null;
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
const IndivDatasets = (props) => {
  // parameter.
  const { match: { params } } = props;
  // const datasetId = parseInt(params.id);

  // query to get the data for the single dataset.
  const { loading, error, data: queryData } = useQuery(getDatasetQuery, {
    variables: { datasetId: parseInt(params.id) },
  });

  // load data from query into state
  const [dataset, setDataset] = useState({
    data: {},
    loaded: false,
  });
  // read dataset data from json file
  const datasetInfo = datasets[params.id];
  // to set the state on the change of the data.
  useEffect(() => {
    if (queryData !== undefined) {
      setDataset({
        data: queryData.dataset,
        loaded: true,
      });
    }
  }, [queryData]);

  // destructuring the compound object.
  const { data } = dataset;
  const pharmacoLink = `https://pharmacodb.ca/pharmacogx?pgx=${params.id}`;
  const resources = React.useMemo(() => formatResouceData(datasetInfo.resource), [datasetInfo.resource]);
  const publications = React.useMemo(() => formatPublicationData(datasetInfo.pub), [datasetInfo.pub]);
  // formatted data for data type table
  const datatypeColumns = React.useMemo(() => DATATYPE_COLUMNS, []);
  const datatypeData = React.useMemo(() => formatDataType(datasetInfo.dtype), [datasetInfo.dtype]);
  return (dataset.loaded ? (
    <Layout page={data[0].name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-compounds">
                <h1>{data[0].name}</h1>
                <StyledSidebar>
                  {SIDE_LINKS.map((link) => createSideLink(link))}
                </StyledSidebar>
                <div className="container">
                  <div className="content">
                    <Element className="section" name="acronym">
                      <h3>Acronym</h3>
                      {datasetInfo.acr_ref ? (<div className="text"><a href={datasetInfo.acr_ref}>{datasetInfo.acr}</a></div>)
                        : (<div className="text">{datasetInfo.acr}</div>)}
                    </Element>
                    <Element className="section" name="description">
                      <h3>Description</h3>
                      <div className="text">{datasetInfo.des}</div>
                    </Element>
                    <Element className="section" name="resources">
                      <h3>Resources</h3>
                      <div className="text">{resources}</div>
                    </Element>
                    <Element className="section" name="publications">
                      <h3>Publications</h3>
                      <div className="text">{publications}</div>
                    </Element>
                    <Element className="section" name="data_type">
                      <h3>Data Types</h3>
                      <Table pivotBy={['type']} columns={datatypeColumns} data={datatypeData} disablePagination />
                    </Element>
                    <Element className="section" name="pharmacogx">
                      <h3>PharmacoGx</h3>
                      <div className="text">
                        <a href={pharmacoLink} target="_blank">
                          PharmacoSet object for:
                          {' '}
                          {datasetInfo.name}
                        </a>
                      </div>
                    </Element>
                    <Element className="section" name="plots">
                      <h3>Plots</h3>
                      {/* <PlotSection dataset={({ id: datasetInfo.id, name: datasetInfo.name })} /> */}
                    </Element>
                  </div>
                </div>
              </StyledIndivPage>
            ))}
      </StyledWrapper>
    </Layout>
  ) : null);
};

IndivDatasets.propTypes = {
  /**
     * IndivCompounds' param id
     */
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndivDatasets;
