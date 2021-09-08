import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../UtilComponents/Layout';
import dataset_colors from '../../../styles/dataset_colors';
import StyledWrapper from '../../../styles/utils';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import AverageDatasetBarPlot from '../../Plots/DatasetHorizontalPlot';
import { getDatasetStatsQuery } from '../../../queries/dataset';
import Loading from '../../UtilComponents/Loading';

/**
 *
 * @param {Boolean} loading
 * @param {Boolean} error
 * @param {Array} data
 *
 * @returns - (
 *  <div className="plot">
        <h3>Average experiments per cell line in each data set</h3>
        <AverageDatasetBarPlot />
      </div>
      <div className="plot">
        <h3>Average experiments per compound in each dataset</h3>
        <AverageDatasetBarPlot />
      </div>
 * )
 */
const renderComponent = (loading, error, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  const experimentsPerCell = [];
  const experimentsPerCompound = [];
  if (data.dataset_stats) {
    data.dataset_stats.forEach((el, i) => {
      const { dataset } = el;
      const { id, name } = dataset;

      experimentsPerCell.push({
        id, name, count: el.experiment_count / el.cell_line_count, color: dataset_colors[i],
      });
      experimentsPerCompound.push({
        id, name, count: el.experiment_count / el.compound_count, color: dataset_colors[i],
      });
    });
  }

  return (
    <>
      <AverageDatasetBarPlot
        data={experimentsPerCell}
        xaxis="Experiments"
        title="Average experiments per cell line in each data set"
      />
      <AverageDatasetBarPlot
        data={experimentsPerCompound}
        xaxis="Experiments"
        title="Average experiments per compound in each dataset"
      />
    </>
  );
};

/**
 * Parent component for the experiments page.
 *
 * @component
 * @example
 *
 * return (
 *   <Experiments/>
 * )
 */
const Experiments = () => {
  const { loading, error, data } = useQuery(getDatasetStatsQuery);

  return (
    <Layout page="experiments">
      <StyledWrapper>
        <PlotsWrapper>
          {renderComponent(loading, error, data)}
        </PlotsWrapper>
      </StyledWrapper>
    </Layout>
  );
};

export default Experiments;
