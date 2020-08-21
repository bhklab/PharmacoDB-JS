import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../../Utils/Layout';
import StyledWrapper from '../../../styles/utils';

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
  return (
  <Layout page="experiments">
    <StyledWrapper>
      <h2>Experiments page</h2>
    </StyledWrapper>
  </Layout>
  )
}

export default Experiments;
