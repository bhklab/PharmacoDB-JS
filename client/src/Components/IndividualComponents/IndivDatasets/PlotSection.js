/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import Loading from '../../UtilComponents/Loading';

/**
 * Section that display plots for the individual Dataset page.
 *
 * @component
 * @example
 *
 * return (
 *   <PlotSection/>
 * )
 */
const PlotSection = (props) => {
  const { dataset } = props;
  const { id } = dataset;

  const { loading, error } = useQuery(getSingleCompoundExperimentsQuery, {
    variables: { datasetId: id },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
    </>
  );
};

PlotSection.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default PlotSection;
