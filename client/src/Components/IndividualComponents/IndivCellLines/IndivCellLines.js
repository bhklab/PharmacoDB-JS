/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getCellLineQuery } from '../../../queries/cell';
import { getDatasetsQuery } from '../../../queries/dataset'
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import SnakeCase from '../../../utils/convertToSnakeCase';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';
import CompoundsSummaryTable from './CompoundsSummaryTable';
import MolecularProfilingTable from './MolecularProfilingTable';
import { StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SYNONYM_COLUMNS = [
    {
        Header: 'Sources',
        accessor: 'datasetObj',
        Cell: (item) => {
            let datasets = item.row.original.datasetObj;
            return(datasets.map((obj, i) => (
                obj.id? (
                    <span key={i}>
                        <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
                    </span>
                ) :
                    (<span key={i}>{obj.name}</span>)
                )
            ));
        }
    },
    {
        Header: 'Names Used',
        accessor: 'name',
    },
];

const SIDE_LINKS = [
  {label: 'Cell Line Data', name: 'data'},
  {label: 'Bar Plot', name: 'barPlot'},
  {label: 'Drugs Summary', name: 'drugsSummary'},
  {label: 'Molecular Profiling', name: 'molecularProfiling'}
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the cell line API
 */
const formatSynonymData = (data) => {
    if (data.synonyms) {
        // define datasetId object to find id of sources
        const datasetId = {};
        data.datasets.forEach((x) => { datasetId[x.name] = x.id ; })
        const tableData = []
        for (let x of data.synonyms) {
                const datasetObj = [];
                for (let item of x.source){
                    datasetObj.push({name:item, id:datasetId[item]});
                }
            tableData.push({name: x.name, datasetObj: datasetObj});
            }

        const pharmacoObj = { name: data.name, datasetObj: [{name: "PharmacoGx", id: ""}]};
        // add the used name of cell line in database
        tableData.push(pharmacoObj);
        return tableData;
    }
    return null;
};

/**
 * Format data for the disease(s) - extract NCIT
 * @param {Array} data diseases data from the cell line API
 */
const formatDiseaseData = (data) => {
    if (data) {
        const ncit_path =
            'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI%20Thesaurus&code=';
        return data.map((x) =>
            x
                ? {
                      key: x.split('; ')[1],
                      name: x,
                      source: ncit_path + x.split('; ')[1],
                  }
                : {
                      key: null,
                      name: 'N/A',
                      source: null,
                  }
        );
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
        return {
            key: data,
            path: cellosaurus_path + data,
            source: 'Cellosaurus',
        };
    }
    return null;
};

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
    const {
        match: { params },
    } = props;
    // query to get the data for the single cell line.
    const { loading, error, data: queryData } = useQuery(getCellLineQuery, {
        variables: { cellId: parseInt(params.id) },
    });
    // load data from query into state
    const [cellLine, setCellLine] = useState({
        data: {},
        loaded: false,
    });
    // A section to display on the page
    const [display, setDisplay] = useState('data');

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

  // formatted data for synonyms annotation table
  const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
  const synonymData = React.useMemo(() => formatSynonymData(data), [data]);
  const diseaseData = React.useMemo(() => formatDiseaseData(data.diseases), [data.diseases]);
  const linkData = React.useMemo(() => formatLinkData(data.accessions), [data.accessions]);
  return (cellLine.loaded ? (
    <Layout page={data.name}>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<NotFoundContent />)
            : (
              <StyledIndivPage className="indiv-cellLines">
                <div className='heading'>
                    <span className='title'>{data.name}</span>
                    <span className='attributes'>
                        Tissue Type:
                        <span className='value highlight'>
                          {data.tissue.name}
                        </span>
                    </span>
                </div>
                <div className='wrapper'>
                  <StyledSidebarList>
                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                  </StyledSidebarList>
                  <div className="container">
                    <div className="content">
                      {
                        display === 'data' &&
                        <React.Fragment>
                          <Element className="section" name="synonyms">
                            <div className='section-title'>Synonyms</div>
                            <Table columns={synonymColumns} data={synonymData}/>
                          </Element>
                          <Element className="section" name="disease(s)">
                            <div className='section-title'>Disease(s)</div>
                            <div className="text">
                              {diseaseData ? diseaseData.map((x) => <a key={x.key} target="_blank" href={x.source}>{x.name}</a>) : 'N/A'}
                            </div>
                          </Element>
                          <Element className="section" name="link(s)">
                            <div className='section-title'>Link(s)</div>
                            <div className="text">
                              {linkData ? (<a key={linkData.key} target="_blank" href={linkData.path}>{linkData.source}</a>) : ''}
                            </div>
                          </Element>
                        </React.Fragment>
                      }
                      <Element>
                        <PlotSection
                          display={display}
                          cellLine={({ id: data.id, name: data.name })}
                        />
                      </Element>
                      {
                        display === 'drugsSummary' &&
                        <Element className="section">
                          <div className='section-title'>Drugs Summary</div>
                          <CompoundsSummaryTable cellLine={({ id: data.id, name: data.name })} />
                        </Element>
                      }
                      {
                        display === 'molecularProfiling' &&
                        <Element className="section">
                          <div className='section-title'>Molecular Profiling</div>
                            <MolecularProfilingTable cellLine={({ id: data.id, name: data.name })} />
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
