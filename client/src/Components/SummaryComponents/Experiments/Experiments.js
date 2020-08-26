import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../Utils/Layout';
import StyledWrapper from '../../../styles/utils';
import PlotsWrapper from '../../../styles/PlotsWrapper';

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
const Experiments = () => (
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

export default Experiments;
