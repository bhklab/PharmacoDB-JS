/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import Table from '../../UtilComponents/Table';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';

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
 * Collect data for the drug summary table
 * @param {Array} data drug summary data from the experiment API
 */
const generateDrugSummaryData = (data) => {
  const compoundObj = {};
  let allDatasets = 0;
  data.experiments.forEach((experiment) => {
    if (compoundObj[experiment.compound.name]) {
      if (!compoundObj[experiment.compound.name].datasets.includes(experiment.dataset.name)) {
        if (compoundObj[experiment.compound.name].datasets.length > allDatasets) allDatasets = compoundObj[experiment.compound.name].datasets.length;
        compoundObj[experiment.compound.name].datasets.push(experiment.dataset.name);
      }
      compoundObj[experiment.compound.name].numExperiments += 1;
    } else {
      compoundObj[experiment.compound.name] = { compound: experiment.compound.name, datasets: [experiment.dataset.name], numExperiments: 1 };
    }
  });
  return { compound: compoundObj, numCompounds: Object.keys(compoundObj).length, numDataset: allDatasets + 1 };
};
/**
 * Format data for the Drug summary table
 * @param {Array} data Drug summary data returned from generate drug summary data
 */
const formatDrugSummaryData = (data) => {
  const compounds = generateDrugSummaryData(data).compound;
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
 * Collect data for the cell line summary data
 * @param {Array} data cell line summary data from the experiment API
 */
const generateCellLineSummaryData = (data) => {
  const cellLineObj = {};
  data.experiments.forEach((experiment) => {
    if (cellLineObj[experiment.cell_line.name]) {
      cellLineObj[experiment.cell_line.name].numExperiments += 1;
    } else {
      cellLineObj[experiment.cell_line.name] = { cellLine: experiment.cell_line.name, numExperiments: 1 };
    }
  });
  return { cellLine: cellLineObj, length: Object.keys(cellLineObj).length };
};

/**
 * Format data for the cell line summary table
 * @param {Array} data cell line summary data returned from generate cell line summary data
 */
const formatCellLineSummaryData = (data) => {
  const cellLines = generateCellLineSummaryData(data).cellLine;
  if (cellLines) {
    return Object.values(cellLines).map((x) => ({
      cellLine: <div style={{ textAlign: 'center' }}> { x.cellLine } </div>,
      experiments_number: x.numExperiments,
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
  return (
    <>
      {
        queryData !== undefined
          ? (
            <>
              <h3>Cell Line Summary</h3>
              <h4>
                <p align="center">
                  Cell lines of
                  {tissue.name}
                  tissue type
                </p>
              </h4>
              <p align="center">
                {generateCellLineSummaryData(queryData).length}
                {' '}
                cell line(s) of this tissue type are currently recorded in database.
              </p>
              <Table columns={CELL_LINE_SUMMARY_COLUMNS} data={formatCellLineSummaryData(queryData)} />
              <h3>Drugs Summary</h3>
              <h4>
                <p align="center">
                  Compounds tested with
                  {tissue.name}
                </p>
              </h4>
              <p align="center">
                {generateDrugSummaryData(queryData).numCompounds}
                {' '}
                compounds have been tested with this tissue, using data from
                {' '}
                {generateDrugSummaryData(queryData).numDataset}
                {' '}
                dataset(s).
              </p>
              <Table columns={DRUG_SUMMARY_COLUMNS} data={formatDrugSummaryData(queryData)} />
            </>
          )
          : <p> No data is available for this table. </p>
        }
    </>
  );
};

TableSection.propTypes = {
  tissue: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default TableSection;
