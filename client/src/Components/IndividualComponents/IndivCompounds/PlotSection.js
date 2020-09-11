/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../Utils/Loading';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import AverageDatasetBarPlot from '../../Plots/DatasetHorizontalPlot';

const generateCountPlotData = (experiments) => {
  const tissueObj = {};
  const cellLineObj = {};
  experiments.forEach((experiment) => {
    if (cellLineObj[experiment.dataset.name]) {
      cellLineObj[experiment.dataset.name].push(experiment.cell_line.id);
    } else {
      cellLineObj[experiment.dataset.name] = [experiment.cell_line.id];
    }
    if (tissueObj[experiment.dataset.name]) {
      tissueObj[experiment.dataset.name].push(experiment.tissue.id);
    } else {
      tissueObj[experiment.dataset.name] = [experiment.tissue.id];
    }
  });
  const tissueData = Object.entries(tissueObj).map((dataset, i) => ({
    name: dataset[0],
    count: [...new Set(dataset[1])].length,
    color: dataset_colors[i],
  }));
  const cellLineData = Object.entries(cellLineObj).map((dataset, i) => ({
    name: dataset[0],
    count: [...new Set(dataset[1])].length,
    color: dataset_colors[i],
  }));
  return [tissueData, cellLineData];
};
/**
 * Plot section of the individula compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <PlotsData/>
 * )
 */
const PlotsData = (props) => {
  const { compoundId } = props;

  const { loading, error, data } = useQuery(getSingleCompoundExperimentsQuery, {
    variables: { compoundId },
  });
  console.log(loading, error, data);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  console.log(data);
  const [tissuesData, cellLinesData] = generateCountPlotData(data.experiments);
  console.log(tissuesData, cellLinesData);
  return (
    <>
      <AverageDatasetBarPlot
        data={cellLinesData}
        xaxis="# of cell lines"
        title={`Number of cell lines tested with ${compoundId} (per dataset)`}
      />
      <AverageDatasetBarPlot
        data={tissuesData}
        xaxis="# of tissues"
        title={`Number of tissues tested with ${compoundId} (per dataset)`}
      />
    </>
  );
};

PlotsData.propTypes = {
  compoundId: PropTypes.number.isRequired,
};

export default PlotsData;
