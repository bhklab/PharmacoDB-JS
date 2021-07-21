/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCountsQuery } from '../../../queries/dataset';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';
import Loading from '../../UtilComponents/Loading';
import colors from '../../../styles/colors';

/**
 * Parses dataset counts data (number of cell lines, experiements, tissues and compounds) into 
 * a data sturcture that can be used for bar plots.
 * @param {*} datasets - an array of dataset objects containing dataset metrics
 * @returns - an object containing parsed plot data for four bar plots.
 */
const generateCountPlotData = (datasets, id) => {
  console.log(datasets);
  const cells = datasets.map(item => ({ 
    name: item.name, 
    count: item.cell_count,
    color: item.id === id ? colors.dark_pink_highlight : colors.light_teal
  }));
  const compounds = datasets.map(item => ({  
    name: item.name, 
    count: item.compound_tested_count,
    color: item.id === id ? colors.dark_pink_highlight : colors.light_teal
  }));
  const experiments = datasets.map(item => ({ 
    name: item.name, 
    count: item.experiment_count,
    color: item.id === id ? colors.dark_pink_highlight : colors.light_teal
  }));
  const tissues = datasets.map(item => ({ 
    name: item.name, 
    count: item.tissue_tested_count,
    color: item.id === id ? colors.dark_pink_highlight : colors.light_teal
  }));

  return { cells: cells, tissues: tissues, compounds: compounds, experiments: experiments };
}

/**
 * Section that display plots for the individual Dataset page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
  const { dataset, display } = props;
  const [plots, setPlots] = useState({
    cells: [],
    tissues: [],
    compounds: [],
    experiments: []
  });
  const [error, setError] = useState(false);

  const { loading } = useQuery(getDatasetCountsQuery, {
    onCompleted: (data) => {
      setPlots(generateCountPlotData(data.datasets, dataset.id));
    },
    onError: () => {setError(true)}
  });

  return (
    <>
      {
        error && <p> Error! </p>
      }
      {
        loading ? (<Loading />)
        :
        <React.Fragment>
          <PlotsWrapper>
            <DatasetHorizontalPlot
              data={plots.cells}
              xaxis="# of cell lines"
              title={`Number of cell lines tested across datasets`}
            />
            <DatasetHorizontalPlot
              data={plots.tissues}
              xaxis="# of tissues"
              title={`Number of tissues tested across datasets`}
            />
          </PlotsWrapper>
          <PlotsWrapper>
            <DatasetHorizontalPlot
              data={plots.compounds}
              xaxis="# of compounds"
              title={`Number of compounds tested across datasets`}
            />
            <DatasetHorizontalPlot
              data={plots.experiments}
              xaxis="# of experiments"
              title={`Number of experiments held across datasets`}
            />
          </PlotsWrapper>
        </React.Fragment>
      }
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
