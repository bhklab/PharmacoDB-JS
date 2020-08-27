import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../Utils/Layout';
import StyledWrapper from '../../../styles/utils';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import { getDatasetCountsQuery } from '../../../queries/dataset';
import Loading from '../../Utils/Loading';
import AverageDatasetBarPlot from './AverageDatasetBarPlot';
import dataset_colors from '../../../styles/dataset_colors';

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
  if (data.datasets) {
    data.datasets.forEach((el, i) => {
      const { id, name } = el;
      experimentsPerCell.push({
        id, name, count: el.experiment_count / el.cell_count, color: dataset_colors[i],
      });
      experimentsPerCompound.push({
        id, name, count: el.experiment_count / el.compound_tested_count, color: dataset_colors[i],
      });
    });
  }
  return (
    <>
      <div className="plot">
        <h3>Average experiments per cell line in each data set</h3>
        <AverageDatasetBarPlot data={experimentsPerCell} />
      </div>
      <div className="plot">
        <h3>Average experiments per compound in each dataset</h3>
        <AverageDatasetBarPlot data={experimentsPerCompound} />
      </div>
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
  const { loading, error, data } = useQuery(getDatasetCountsQuery);
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
