/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getGeneCompoundDatasetQuery } from '../../../queries/gene_compound';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';

/**
 * A helper function that processes data from the API to be subsequently loaded it into
 * compound horizontal plots
 * @param {Array} geneCompounds - list of compound-dataset combinations for a given gene returned by the API
 * @returns - array of items. Elements of the array are a list of data points for gene-compound plots respectively
 * Each data point contains name, count and color properties
 * @example
 * [{name: "GDSC1000", count: 208, color: "#08589e"}, ... ]
 */
const generateCountPlotData = (geneCompounds) => {
  let uniqueDatasetIds = geneCompounds.map(item => item.dataset.id);
  uniqueDatasetIds = [...new Set(uniqueDatasetIds)];
  let plotData = [];
  for (const [i, datasetId] of uniqueDatasetIds.entries()) {
    let filtered = geneCompounds.filter(item => item.dataset.id === datasetId);
    let uniqueCompounds = filtered.map(item => item.compound.id);
    uniqueCompounds = [...new Set(uniqueCompounds)];
    plotData.push({
      name: filtered[0].dataset.name,
      count: uniqueCompounds.length,
      color: dataset_colors[i]
    });
  }
  return plotData;
};
/**
 * Section that display plots for the individual gene page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
  const { gene } = props;

  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const { loading } = useQuery(getGeneCompoundDatasetQuery, {
    variables: { geneId: gene.id },
    onCompleted: (data) => {
      setData(generateCountPlotData(data.gene_compound_dataset));
    },
    onError: (err) => {
      console.log(err);
      setError(true);
    }
  });

  return (
    <React.Fragment>
      {
        loading ? <Loading />
          :
          error ? <Error />
            :
            <PlotsWrapper single={true}>
              <DatasetHorizontalPlot
                plotId='gene_compound_dataset_plot'
                data={data}
                xaxis="# of compounds"
                title={`Number of compounds targeting ${gene.annotation.symbol} (per dataset)`}
              />
            </PlotsWrapper>
      }
    </React.Fragment>
  );
};

PlotSection.propTypes = {
  gene: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default PlotSection;
