/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../Utils/Layout';
import { getCompoundsQuery } from '../../queries/queries';

import StyledWrapper from '../../styles/utils';

/**
 * Parent component for the compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Compounds/>
 * )
 */
const Compounds = () => {
  const { loading, error, data } = useQuery(getCompoundsQuery);

  return (
    <Layout>
      <StyledWrapper>
        {loading ? (<p>Loading...</p>)
          : (error ? (<p>Error!</p>)
            : data.compounds.map(({ id, name }) => (
              <div key={id}>
                <p>
                  {id}
                  :
                  {' '}
                  {name}
                </p>
              </div>
            )))}
      </StyledWrapper>

    </Layout>
  );
};

export default Compounds;
