import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../Utils/Layout';
import StyledWrapper from '../../../styles/utils';
import PlotsWrapper from '../../../styles/PlotsWrapper';
import { getDatasetCountsQuery } from '../../../queries/dataset';
import Loading from '../../Utils/Loading';

/**
 *
 * @param {Boolean} loading
 * @param {Boolean} error
 * @param {Array} columns
 * @param {Array} data
 *
 * @returns - (
 *  <h3> Title for the barplot </h3>
 *  <BarPlot/>
 *  <h2> Title for the table </h2>
 *  <Table/>
 * )
 */
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      Plots
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
  const { loading, error, data: dataset } = useQuery(getDatasetCountsQuery);
  console.log(loading, error, dataset);
  return (
    <Layout page="experiments">
      <StyledWrapper>
        <PlotsWrapper>
          <div className="plot">
            <h3>Average experiments per cell line in each data set</h3>
          </div>
          <div className="plot">
            <h3>Average experiments per compound in each dataset</h3>
          </div>
        </PlotsWrapper>
      </StyledWrapper>
    </Layout>
  );
};

export default Experiments;
