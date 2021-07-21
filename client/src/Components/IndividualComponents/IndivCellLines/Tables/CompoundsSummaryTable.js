/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSingleCellLineExperimentsQuery } from '../../../../queries/experiments';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const DRUG_SUMMARY_COLUMNS = [
  {
    Header: 'Compounds',
    accessor: 'compound',
    Cell: (item) => (<Link to={`/compounds/${item.row.original.compoundId}`}>{item.value}</Link>),
  },
  {
    Header: 'Datasets',
    accessor: 'dataset',
    Cell: (item) => {
      const datasets = item.cell.row.original.datasetObj;
      return (datasets.map((obj, i) => (
        <span key={i}>
          <a href={`/datasets/${obj.id}`}>{obj.name}</a>
          { i + 1 < datasets.length ? ', ' : ''}
        </span>
      )));
    },
  },
  {
    Header: 'Experiments',
    accessor: 'num_experiments',
  },
];

/**
 * Format data for the compound summary table
 * @param {Array} data compound summary data from the experiment API
 */
const generateTableData = (data) => {
  let tableData = { ready: false, compound: [], numCompounds: 0, numDataset: 0 };
  if (data) {
    let uniqueCompounds = [...new Set(data.map(item => item.compound.id))];
    let uniqueDatasets = [...new Set(data.map(item => item.dataset.id))];
    let compounds = [];
    for(let id of uniqueCompounds){
      let experiments = data.filter(item => item.compound.id === id);

      let datasets = experiments.map(item => item.dataset);
      let datasetIds = [...new Set(datasets.map(item => item.id))];
      let datasetObj = [];
      for(let id of datasetIds){
        let found = datasets.find(item => item.id === id);
        datasetObj.push(found);
      }
      datasetObj.sort((a, b) => a - b);

      compounds.push({
        compound: experiments[0].compound.name,
        dataset: datasetObj.map(item => item.name).join(' '),
        num_experiments: experiments.length,
        id: experiments[0].compound.id,
        datasetObj: datasetObj
      });
    }
    compounds.sort((a, b) => b.num_experiments - a.num_experiments);
    tableData.compound = compounds;
    tableData.numCompounds = uniqueCompounds.length;
    tableData.numDataset = uniqueDatasets.length;
    tableData.ready = true;
  }
  return tableData;
};
/**
 * Section that display compounds(drug) summary plots for the individual cell Line page.
 *
 * @component
 * @example
 *
 * returns (
 *   <CompoundsSummaryTable/>
 * )
 */
const CompoundsSummaryTable = (props) => {
  const { cellLine } = props;
  const [tableData, setTableData] = useState({ ready: false, compound: [], numCompounds: 0, numDataset: 0 });
  const [csv, setCSV] = useState([]);
  const [error, setError] = useState(false);

  const { loading, data: queryData,} = useQuery(getSingleCellLineExperimentsQuery, {
      variables: { cellLineId: cellLine.id },
      onCompleted: (data) => {
        console.log(data);
        let parsed = generateTableData(data.experiments)
        setTableData(parsed);
        setCSV(parsed.compound.map(item => ({
          cellLineId: cellLine.id,
          cellLineName: cellLine.name,
          compound: item.compound,
          compoundId: item.id,
          dataset: item.dataset,
          numExperiments: item.num_experiments,
        })));
      },
      onError: (err) => {
        setError(true);
      }
  });
    // load data from query into state
  const [experiment, setExperiment] = useState({
    data: {},
    loaded: false,
  });
    // to set the state on the change of the data.
  useEffect(() => {
    if (queryData !== undefined) {
      setExperiment({
        data: queryData.experiments,
        loaded: true,
      });
    }
  }, [queryData]);
  return (
      <React.Fragment>
        {
          error && <p> Error! </p>
        }
        {
          loading || !tableData.ready ? <Loading />
              :
              <React.Fragment>
                <h4>
                  <p align="center">
                    { `Compounds tested with ${cellLine.name}` }
                  </p>
                </h4>
                <p align="center">
                  { `${tableData.numCompounds} compounds have been tested with this tissue, using data from ${tableData.numDataset} dataset(s).` }
                </p>
                <div className='download-button'>
                  <DownloadButton
                      label='CSV'
                      data={csv}
                      mode='csv'
                      filename={`${cellLine.name} - compounds`}
                  />
                </div>
                <Table columns={DRUG_SUMMARY_COLUMNS} data={tableData.compound} />
              </React.Fragment>
        }
      </React.Fragment>
  );
};

CompoundsSummaryTable.propTypes = {
  cellLine: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default CompoundsSummaryTable;
