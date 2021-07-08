/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import datasets from './datasets';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';

import { StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';
import { getDatasetQuery } from '../../../queries/dataset';

const SIDE_LINKS = [
  { label: 'Dataset Information', name: 'info' },
  { label: 'Resources', name: 'resources' },
  { label: 'Data type', name: 'datatype' },
  { label: 'Bar Plots', name: 'barPlots' }
];

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

  // A section to display on the page
  const [display, setDisplay] = useState('info');

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


  /**
   * 
   * @param {String} link 
   */
  const createSideLink = (link, i) => (
    <li key={i} className={display === link.name ? 'selected': undefined}>
        <button type='button' onClick={() => setDisplay(link.name)}>
            {link.label}
        </button>
    </li>
  );

  return (dataset.loaded ? (
    <Layout page={data[0].name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-compounds">
                <div className='heading'>
                    <span className='title'>{data[0].name}</span>
                </div>
                <div className='wrapper'>
                  <StyledSidebarList>
                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                  </StyledSidebarList>
                  <div className="container">
                    <div className="content">
                      {
                        display === 'info' &&
                        <React.Fragment>
                          <Element className="section" name="acronym">
                            <div className='section-title'>Acronym</div>
                            {datasetInfo.acr_ref ? (<div className="text"><a href={datasetInfo.acr_ref}>{datasetInfo.acr}</a></div>)
                              : (<div className="text">{datasetInfo.acr}</div>)}
                          </Element>
                          <Element className="section" name="description">
                            <div className='section-title'>Description</div>
                            <div className="text">{datasetInfo.des}</div>
                          </Element>
                          <Element className="section" name="publications">
                            <div className='section-title'>Publications</div>
                            <div className="text">{publications}</div>
                          </Element>
                          <Element className="section" name="pharmacogx">
                            <div className='section-title'>PharmacoGx</div>
                            <div className="text">
                              <a href={pharmacoLink} target="_blank">
                                PharmacoSet object for:
                                {' '}
                                {datasetInfo.name}
                              </a>
                            </div>
                          </Element>
                        </React.Fragment>
                      }
                      {
                        display === 'resources' &&
                        <Element className="section" name="resources">
                          <div className='section-title'>Resources</div>
                          <div className="text">{resources}</div>
                        </Element>
                      }
                      {
                        display === 'datatype' &&
                        <Element className="section" name="data_type">
                          <div className='section-title'>Data Types</div>
                          <Table pivotBy={['type']} columns={datatypeColumns} data={datatypeData} disablePagination />
                        </Element>
                      }
                      {
                        <Element>
                          <PlotSection dataset={({ id: datasetInfo.id, name: datasetInfo.name })} display={display} />
                        </Element>
                      }
                    </div>
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
