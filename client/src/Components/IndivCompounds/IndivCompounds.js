/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import Layout from '../Layout/Layout';
import { getCompoundQuery } from '../../queries/queries';

/**
 * Parent component for the individual compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Compounds/>
 * )
 */
const IndivCompounds = (props) => {
  const { match: { params } } = props;
  const { loading, error, data } = useQuery(getCompoundQuery, {
    variables: { compoundId: params.id.toString() },
  });
  console.log(data);
  return (
    <Layout>
      {loading ? (<p>Loading...</p>)
        : (error ? (<p>Error!</p>)
          : (
            <div>hi</div>
          ))}
    </Layout>
  );
};

export default IndivCompounds;
