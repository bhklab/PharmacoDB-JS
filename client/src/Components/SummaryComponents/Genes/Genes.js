import React from 'react';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import GenesPlot from './GenesPlot';
import GenesTable from './GenesTable';

/**
 * Parent component for the compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Genes/>
 * )
 */
const Genes = () => {
  return (
    <Layout page="genes">
      <StyledWrapper>
        <GenesPlot />
        <GenesTable />
      </StyledWrapper>
    </Layout>
  );
};

export default Genes;
