/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import {getDatasetQuery} from "../../../queries/dataset";

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
  const compoundObj = {};
  const experimentObj = {};
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

    if (compoundObj[experiment.dataset.name]) {
      compoundObj[experiment.dataset.name].push(experiment.compound.id);
    } else {
      compoundObj[experiment.dataset.name] = [experiment.compound.id];
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
  const compoundData = Object.entries(compoundObj).map((dataset, i) => ({
    name: dataset[0],
    count: [...new Set(dataset[1])].length,
    color: dataset_colors[i],
  }));
  return [tissueData, cellLineData, compoundData];
};
/**
 * Section that display plots for the individula compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
  const { dataset } = props;
  const { id } = dataset;

  const { loading, error, data } = useQuery(getDatasetQuery, {
    variables: { datasetId: id },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  const [tissuesData, cellLinesData, compoundsData, experimentsData] = generateCountPlotData(data.experiments);
  console.log(tissuesData, cellLinesData, compoundsData);
  return (
    <>
      <DatasetHorizontalPlot
        data={cellLinesData}
        xaxis="# of cell lines"
        title="Number of cell lines tested across datasets"
      />
      <DatasetHorizontalPlot
        data={tissuesData}
        xaxis="# of tissues"
        title="Number of tissues tested across datasets"
      />
      <DatasetHorizontalPlot
        data={compoundsData}
        xaxis="# of tissues"
        title="Number of compounds tested across datasets"
      />
      <DatasetHorizontalPlot
        data={experimentsData}
        xaxis="# of tissues"
        title="Number of experiments held across datasets"
      />
    </>
  );
};

PlotSection.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default PlotSection;
