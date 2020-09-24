/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../Utils/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';

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
  const { compound } = props;
  const { id, name } = compound;

  const { loading, error, data } = useQuery(getSingleCompoundExperimentsQuery, {
    variables: { compoundId: id },
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
      <DatasetHorizontalPlot
        data={cellLinesData}
        xaxis="# of cell lines"
        title={`Number of cell lines tested with ${name} (per dataset)`}
      />
      <DatasetHorizontalPlot
        data={tissuesData}
        xaxis="# of tissues"
        title={`Number of tissues tested with ${name} (per dataset)`}
      />
    </>
  );
};

PlotsData.propTypes = {
  compound: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default PlotsData;
