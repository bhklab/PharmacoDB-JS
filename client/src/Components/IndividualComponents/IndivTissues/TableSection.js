/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueExperimentsQuery } from '../../../queries/experiments';
import Loading from '../../UtilComponents/Loading';
import Table from '../../UtilComponents/Table';

const DRUG_SUMMARY_COLUMNS = [
  {
    Header: 'Compounds',
    accessor: 'compound',
  },
  {
    Header: 'Datasets',
    accessor: 'dataset',
  },
  {
    Header: 'Experiments',
    accessor: 'experiments_number',
  },
];

const CELL_LINE_SUMMARY_COLUMNS = [
  {
    Header: 'Cell Line',
    accessor: 'cellLine',
  },
];

/**
 * Collect data for the drug summary and cell line summary tables
 * @param {Array} data drug summary and cell line summary data from the experiment API
 */
const generateTablesData = (data) => {
  if (data.experiments) {
    const compoundObj = {};
    const cellLineObj = {};
    let allDatasets = 0;
    data.experiments.forEach((experiment) => {
      const compoundName = experiment.compound.name;
      const cellName = experiment.cell_line.name;
      if (compoundObj[compoundName]) {
        if (!compoundObj[compoundName].datasets.includes(compoundName)) {
          if (compoundObj[compoundName].datasets.length > allDatasets) allDatasets = compoundObj[compoundName].datasets.length;
          compoundObj[compoundName].datasets.push(compoundName);
        }
        compoundObj[compoundName].numExperiments += 1;
      } else {
        compoundObj[compoundName] = { compound: compoundName, datasets: [compoundName], numExperiments: 1 };
      }
      if (!cellLineObj[cellName]) {
        cellLineObj[cellName] = { cellLine: cellName };
      }
    });
    return {
      compound: compoundObj, numCompounds: Object.keys(compoundObj).length, numDataset: allDatasets + 1, cellLine: cellLineObj,
    };
  }
  return null;
};
/**
 * Format data for the Drug summary table
 * @param {Array} data Drug summary data returned from generate drug summary data
 */
const formatDrugSummaryData = (compounds) => {
  if (compounds) {
    return Object.values(compounds).map((x) => ({
      compound: x.compound,
      dataset: x.datasets.join(', '),
      experiments_number: x.numExperiments,
    }));
  }
  return null;
};

/**
 * Format data for the cell line summary table
 * @param {Array} data cell line summary data returned from generate cell line summary data
 */
const formatCellLineSummaryData = (cellLines) => {
  if (cellLines) {
    return Object.values(cellLines).map((x) => ({
      cellLine:
  <div style={{ textAlign: 'center' }}>
    {' '}
    { x.cellLine }
    {' '}
  </div>,
    }));
  }
  return null;
};

/**
 * Section that display plots for the individual tissue page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const TableSection = (props) => {
  const { tissue } = props;
  const { id } = tissue;
  const { loading, error, data: queryData } = useQuery(getSingleTissueExperimentsQuery, {
    variables: { tissueId: id },
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
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  const { data } = experiment;
  const {
    cellLine, compound, numDataset, numCompounds,
  } = generateTablesData(queryData);
  return (data ? (
    <>
      {
        queryData !== undefined
          ? (
            <>
              <h3>Cell Line Summary</h3>
              <h4>
                <p align="center">
                  Cell lines of
                  {' '}
                  {tissue.name}
                  {' '}
                  tissue type
                </p>
              </h4>
              <p align="center">
                {cellLine.length}
                {' '}
                cell line(s) of this tissue type are currently recorded in database.
              </p>
              <Table columns={CELL_LINE_SUMMARY_COLUMNS} data={formatCellLineSummaryData(cellLine)} />
              <h3>Drugs Summary</h3>
              <h4>
                <p align="center">
                  Compounds tested with
                  {' '}
                  {tissue.name}
                </p>
              </h4>
              <p align="center">
                {numCompounds}
                {' '}
                compounds have been tested with this tissue, using data from
                {' '}
                {numDataset}
                {' '}
                dataset(s).
              </p>
              <Table columns={DRUG_SUMMARY_COLUMNS} data={formatDrugSummaryData(compound)} />
            </>
          )
          : <p> Loading... </p>
        }
    </>
  ) : null);
};

TableSection.propTypes = {
  tissue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default TableSection;
