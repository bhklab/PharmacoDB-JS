/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCellLineExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import ProfileCompound from '../../Plots/ProfileCompound';

/**
 * A helper function that processes data from the API to be subsequently loaded it into
 * compound horizontal plots
 * @param {Array} experiments - list of experiments for a given cell line returned by the API
 * @returns - array of items. Elements of the array are a list of data points for compound plots respectively
 * Each data point contains name, count and color properties
 * @example
 * [{name: "GDSC1000", count: 208, color: "#08589e"}, ... ]
 */
const generateCountPlotData = (experiments) => {
  const compoundObj = {};
  experiments.forEach((experiment) => {
    if (compoundObj[experiment.dataset.name]) {
      compoundObj[experiment.dataset.name].push(experiment.compound.id);
    } else {
      compoundObj[experiment.dataset.name] = [experiment.compound.id];
    }
  });
  const compoundData = Object.entries(compoundObj).map((dataset, i) => ({
    name: dataset[0],
    count: [...new Set(dataset[1])].length,
    color: dataset_colors[i],
  }));
  return [compoundData];
};
/**
 * Section that display plots for the individual cell Line page.
 *
 * @component
 * @example
 *
 * return (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
  const { cellLine } = props;
  const { id, name } = cellLine;

  const { loading, error, data } = useQuery(getSingleCellLineExperimentsQuery, {
    variables: { cellLineId: id },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  const [compoundsData] = generateCountPlotData(data.experiments);
  return (
    <>
      {
          compoundsData.length
            ? (
              <>
                <DatasetHorizontalPlot
                  data={compoundsData}
                  xaxis="# of compounds"
                  title={`Number of compounds tested with ${name} (per dataset)`}
                />
                <ProfileCompound cellLine={name} data={data.experiments} />
              </>
            )
            : <p> No data is available for plotting this cell line. </p>
        }
    </>
  );
};

PlotSection.propTypes = {
  cellLine: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default PlotSection;
