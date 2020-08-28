import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../Utils/Layout';
import Table from '../../Table/Table';
import { getGenesQuery } from '../../../queries/gene';

const Genes = () => (
  <Layout page="genes">
    <StyledWrapper>
      <div> Tissues Page! </div>
    </StyledWrapper>
  </Layout>
);

export default Genes;
