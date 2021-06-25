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
  // {
  //   Header: 'rnaseq',
  //   accessor: 'tissue',
  // },
  // {
  //   Header: 'mutation',
  //   accessor: 'tissue',
  // },
  // {
  //   Header: 'cnv',
  //   accessor: 'tissue',
  // },
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the cell line API
 */
const formatDrugSummaryData = (experiment) => {
  if (experiment) {
    console.log(experiment.experiments);
    return experiment.experiments.map((x) => ({
      compound: x.compound.name,
      dataset: x.dataset.name,
      experiment_id: x.id,
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
              <p> data is available for this table. </p>
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
