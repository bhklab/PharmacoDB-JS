/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getGeneQuery } from '../../../queries/gene';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';
import CompoundsSummaryTable from './Tables/CompoundsSummaryTable';
import TopDrugsTable from './Tables/TopDrugsTable';

import {
  StyledIndivPage,
  StyledSidebarList,
} from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SYNONYM_COLUMNS = [
  {
    Header: 'Ensembl Gene ID',
    accessor: 'id',
  },
];

const LINK_COLUMNS = [
  {
    Header: 'Genecard',
    accessor: 'id',
  },
];

const SIDE_LINKS = [
  { label: 'Synonyms and Links', name: 'synonyms' },
  { label: 'Plots', name: 'plots' },
  { label: 'Drugs Summary', name: 'drugsSummary' },
  { label: 'Top Drugs', name: 'topDrugs' }
];

/**
 * Format data for synonym and link tables
 * @param {String} id,link gene id and link to reference
 */
const formatTableLinks = (id, link) => [
  {
    id: (
      <a href={link} target="_blank">
        <div style={{ textAlign: 'center' }}> {id} </div>
      </a>
    ),
  },
];

/**
 * Format data for the synonyms table
 * @param data synonym data from the gene API
 */
const formatSynonymData = (data) => {
  if (data) {
    const link = `http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${data.name}`;
    return formatTableLinks(data.name, link);
  }
  return null;
};

  /**
   * Format data for link table
   * @param data link data from the gene API
   */
  const formatLinkData = (data) => {
    if (data) {
      const link = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${data.name}`;
      return formatTableLinks(data.name, link);
    }
    return null;
  };

/**
 * Parent component for the individual gene page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivGenes/>
 * )
 */
const IndivGenes = (props) => {
  // parameter.
  const { match: { params } } = props;

  // load data from query into state
  const [gene, setGene] = useState({
    data: {},
    loaded: false,
    notFound: false,
    error: false
  });

  // A section to display on the page
  const [display, setDisplay] = useState('synonyms');

  // query to get the data for the single gene.
  const { loading } = useQuery(getGeneQuery, {
    variables: { geneId: parseInt(params.id) },
    onCompleted: (data) => {
        console.log(data);
        if (data.gene.name !== 'empty') {
            setGene({
              ...gene, 
              data: {
                ...data.gene,
                synonyms: formatSynonymData(data.gene), 
                links: formatLinkData(data.gene)
              }, 
              loaded: true
            });
        }else{
            setGene({...gene, notFound: true});
        }
    },
    onError: () => {
        setGene({...gene, error: true});
    }
  });

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
    <Layout page={gene.data.name}>
      <StyledWrapper>
        {
          loading ? <Loading />
          :
          gene.notFound ? <NotFoundContent />
          :
          gene.error ? <Error />
          :
          <StyledIndivPage className="indiv-genes">
            <div className='heading'>
              <span className='title'>{gene.data.name}</span>
              <span className='attributes'>
              </span>
            </div>
            <div className='wrapper'>
              <StyledSidebarList>
                {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
              </StyledSidebarList>
              <div className="container">
                <div className="content">
                  {
                    display === 'synonyms' &&
                    <React.Fragment>
                      <Element className="section" name="synonyms">
                        <div className='section-title'>Synonyms and Links</div>
                        <Table columns={SYNONYM_COLUMNS} data={gene.data.synonyms} disablePagination />
                      </Element>
                      <Element className="section" name="links">
                        <div className='section-title'>Links</div>
                        <Table columns={LINK_COLUMNS} data={gene.data.links} disablePagination />
                      </Element>
                    </React.Fragment>
                  }
                  {
                    display === 'plots' &&
                    <Element className='section'>
                      <div className='section-title'>Plots</div>
                      <PlotSection gene={gene.data} />
                    </Element>
                  }
                  {
                    display === 'drugsSummary' &&
                    <Element className='section'>
                      <div className='section-title'>Compounds Summary</div>
                      <CompoundsSummaryTable gene={gene.data} />
                    </Element>
                  }
                  {
                    display === 'topDrugs' &&
                    <Element className='section'>
                      <div className='section-title'>Top Drugs</div>
                      <TopDrugsTable gene={gene.data} />
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

IndivGenes.propTypes = {
  /**
   * IndivGenes' param id
   */
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IndivGenes;
