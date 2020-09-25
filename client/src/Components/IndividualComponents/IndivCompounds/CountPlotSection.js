/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../Utils/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import ProfileCellLine from '../../Plots/ProfileCellLine';

/**
 * A helper function that processes data from the API to be subsequently loaded it into
 * cell line and tissue dataset horizontal plots
 * @param {Array} experiments - list of experiments for a given drug returned by the API
 * @returns - array of two items. Elements of the array are a list of data points for tissue and cell line plots respectively
 * Each data point contains name, count and color properties
 * @example
 * [[{name: "CTRPv2", count: 25, color: "#ccebc5"}], ... ]
 */
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
 * Section that display count plots for the individula compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <CountPlotSection/>
 * )
 */
const CountPlotSection = (props) => {
  const { compound } = props;
  const { id, name } = compound;

  const { loading, error, data } = useQuery(getSingleCompoundExperimentsQuery, {
    variables: { compoundId: id },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  const [tissuesData, cellLinesData] = generateCountPlotData(data.experiments);
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
      <ProfileCellLine data={data.experiments} />
    </>
  );
};

CountPlotSection.propTypes = {
  compound: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default CountPlotSection;
