/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import datasets from './datasets';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';
import CellLineSummaryTable from './Tables/CellLineSummaryTable';
import CompoundsSummaryTable from './Tables/CompoundsSummaryTable';

import { StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SIDE_LINKS = [
  { label: 'Dataset Information', name: 'info' },
  { label: 'Resources', name: 'resources' },
  { label: 'Data types', name: 'datatype' },
  { label: 'Bar Plots', name: 'barPlots' },
  { label: 'Summary Cell Lines', name: 'cellLines' },
  { label: 'Summary Compounds', name: 'compounds' },
];

const DATATYPE_COLUMNS = [
  {
    Header: () => <div style={{ textAlign: 'left' }}>Data Type</div>,
    accessor: 'type',
    disableSortBy: true,
    merged: true
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Assay/Platform</div>,
    accessor: 'platform',
    disableSortBy: true
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Raw</div>,
    accessor: 'raw',
    disableSortBy: true
  },
  {
    Header: <div style={{ textAlign: 'left' }}>Processed</div>,
    accessor: 'processed',
    disableSortBy: true
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
 * Get a PSet data of the selected dataset and extract the link to 
 * its ORCESTRA page.
 * @param {String} selected
 * @param {Array} psets 
 */
const getORCESTRALink = (selected, psets) => {
  let link = '';
  if (psets.length > 0) {
    link = 'https://www.orcestra.ca/pset/';
    let pset = {};
    switch (selected.name) {
      case 'GDSC1':
        pset = psets.find(item => item.name.split('_')[0] === 'GDSC' && item.name.substr(item.name.indexOf('v') + 1, 1) === '1');
        break;
      case 'GDSC2':
        pset = psets.find(item => item.name.split('_')[0] === 'GDSC' && item.name.substr(item.name.indexOf('v') + 1, 1) === '2');
        break;
      default:
        pset = psets.find(item => item.name.split('_')[0] === selected.name);
        break;
    }
    link = `${link}${pset.doi}`;
  }
  return link;
}

/**
 * Parent component for the individual datasets page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivDatasets/>
 * )
 */
const IndivDatasets = (props) => {
  // parameter.
  const { match: { params } } = props;

  const [dataset, setDataset] = useState({
    resources: [],
    publications: [],
    datatypes: [],
    notFound: false
  });

  // A section to display on the page
  const [display, setDisplay] = useState('info');

  // to set the state on the change of the data.
  useEffect(() => {
    /**
     * Component mount operation wrapped in async function since 
     * We are accessing ORCESTRA's API to fetch data.
     */
    const getData = async () => {
      // Retreives ORCESTRA's canonical psets data to display link to the dataset's PSet in ORCESTRA.
      let psets = [];
      try {
        const res = await fetch('https://www.orcestra.ca/api/psets/canonical');
        psets = await res.json();
      } catch (err) {
        console.log(err);
      }

      // read dataset data from json file
      const selected = datasets[params.id];
      if (selected) {
        setDataset({
          ...selected,
          resources: formatResouceData(selected.resource),
          publications: formatPublicationData(selected.pub),
          datatypes: formatDataType(selected.dtype),
          orcestra: getORCESTRALink(selected, psets)
        });
      } else {
        setDataset({ ...dataset, notFound: true });
      }
    }
    getData();
  }, []);

  /**
   * 
   * @param {String} link 
   */
  const createSideLink = (link, i) => (
    <li key={i} className={display === link.name ? 'selected' : undefined}>
      <button type='button' onClick={() => setDisplay(link.name)}>
        {link.label}
      </button>
    </li>
  );

  return (
    <Layout page={dataset.name}>
      <StyledWrapper>
        {
          dataset.notFound ?
            <NotFoundContent />
            :
            <StyledIndivPage className="indiv-datasets">
              <div className='heading'>
                <span className='title'>{dataset.name}</span>
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
                          {dataset.acr_ref ? (<div className="text"><a href={dataset.acr_ref}>{dataset.acr}</a></div>)
                            : (<div className="text">{dataset.acr}</div>)}
                        </Element>
                        <Element className="section" name="description">
                          <div className='section-title'>Description</div>
                          <div className="text">{dataset.des}</div>
                        </Element>
                        <Element className="section" name="publications">
                          <div className='section-title'>Publications</div>
                          <div className="text">{dataset.publications}</div>
                        </Element>
                        <Element className="section" name="pharmacogx">
                          <div className='section-title'>PharmacoGx</div>
                          <div className="text">
                            <a href={`./pharmacogx/${params.id}`} target="_blank">
                              PharmacoSet object for:
                            {' '}
                              {dataset.name}
                            </a>
                          </div>
                        </Element>
                        {
                          dataset.orcestra && dataset.orcestra.length > 0 &&
                          <Element className="section" name="pharmacogx">
                            <div className='section-title'>ORCESTRA</div>
                            <div className="text">
                              <a href={dataset.orcestra} target="_blank" rel="noopener noreferrer">
                                {`PharmacoSet object for ${dataset.name} in ORCESTRA`}
                              </a>
                            </div>
                          </Element>
                        }
                      </React.Fragment>
                    }
                    {
                      display === 'resources' &&
                      <Element className="section" name="resources">
                        <div className='section-title'>Resources</div>
                        <div className="text">{dataset.resources}</div>
                      </Element>
                    }
                    {
                      display === 'datatype' &&
                      <Element className="section" name="data_type">
                        <div className='section-title'>Data Types</div>
                        <Table
                          pivotBy={['type']}
                          columns={DATATYPE_COLUMNS}
                          data={dataset.datatypes}
                          disablePagination
                        />
                      </Element>
                    }
                    {
                      display === 'barPlots' &&
                      <Element>
                        <PlotSection dataset={({ id: dataset.id, name: dataset.name })} display={display} />
                      </Element>
                    }
                    {
                      display === 'cellLines' &&
                      <Element className="section" name="cellLines">
                        <CellLineSummaryTable dataset={({ id: dataset.id, name: dataset.name })} />
                      </Element>
                    }
                    {
                      display === 'compounds' &&
                      <Element className="section" name="cellLines">
                        <CompoundsSummaryTable dataset={({ id: dataset.id, name: dataset.name })} />
                      </Element>
                    }
                  </div>
                </div>
              </div>
            </StyledIndivPage>
        }
      </StyledWrapper>
    </Layout>
  );
};

IndivDatasets.propTypes = {
  /**
     * IndivDatasets' param id
     */
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndivDatasets;
