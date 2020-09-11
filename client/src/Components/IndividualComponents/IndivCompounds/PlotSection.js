/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../Utils/Loading';

/**
 * Plot section of the individula compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <PlotsData/>
 * )
 */
const PlotsData = (props) => {
  const { compoundId } = props;

  const { loading, error, data } = useQuery(getSingleCompoundExperimentsQuery, {
    variables: { compoundId },
  });
  console.log(loading, error, data);
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }

  return null;
};

PlotsData.propTypes = {
  compoundId: PropTypes.number.isRequired,
};

export default PlotsData;
