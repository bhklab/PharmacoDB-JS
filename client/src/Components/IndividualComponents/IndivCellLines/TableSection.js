/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, {useEffect, useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCellLineExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import ProfileCompound from '../../Plots/ProfileCompound';
import Table from '../../UtilComponents/Table';
import {NotFoundContent} from "../../UtilComponents/NotFoundPage";

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
    accessor: 'experiment_id',
  },
];

const MOLECULAR_PROFILING_COLUMNS = [
  {
    Header: 'Datasets',
    accessor: 'name',
  },
  {
    Header: 'rna',
    accessor: 'tissue',
  },
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the cell line API
 */
const formatDrugSummaryData = (data) => {
  // collect data of datasets and number of experiments for each compound
  const compoundObj = {};
  data.experiments.forEach((experiment) => {
    const compoundName = experiment.compound.name;
    const datasetName = experiment.dataset.name;
    if (compoundObj[compoundName]) {
      if (!compoundObj[compoundName].datasets.includes(datasetName)) compoundObj[compoundName].datasets.push(datasetName);
      compoundObj[compoundName].numExperiments += 1;
    } else {
      compoundObj[compoundName] = { compound: compoundName, datasets: [datasetName], numExperiments: 1 };
    }
  });
  // assign values of collected compound data to the columns
  if (data) {
    return Object.values(compoundObj).map((x) => ({
      compound: x.compound,
      dataset: x.datasets.join(', '),
      experiment_id: x.numExperiments,
    }));
  }
  return null;
};

/**
 * Section that display plots for the individual cell Line page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const TableSection = (props) => {
  const { cellLine } = props;
  const { id } = cellLine;
  const { loading, error, data: queryData } = useQuery(getSingleCellLineExperimentsQuery, {
    variables: { cellLineId: id },
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
              <Table columns={DRUG_SUMMARY_COLUMNS} data={formatDrugSummaryData(queryData)} />
            </>
          )
          : <p> No data is available for this table. </p>
        }
    </>
  );
};

TableSection.propTypes = {
  cellLine: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default TableSection;
