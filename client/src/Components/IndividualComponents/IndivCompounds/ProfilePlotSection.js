/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
// import { getSingleCompoundExperimentsQuery } from '../../../queries/experiments';
import dataset_colors from '../../../styles/dataset_colors';
import Loading from '../../Utils/Loading';
// import DatasetHorizontalPlot from '../../Plots/DatasetHorizontalPlot';

/**
 * Profile plots of the individula compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <ProfilePlotSection/>
 * )
 */
const ProfilePlotSection = (props) => {
  const { compound } = props;
  const { id, name } = compound;

  // const { loading, error, data } = useQuery(getSingleCompoundExperimentsQuery, {
  //   variables: { compoundId: id },
  // });

  // if (loading) {
  //   return <Loading />;
  // }
  // if (error) {
  //   return <p> Error! </p>;
  // }
  return (
    <>
      <div>Profile Plot1</div>
      <div>Profile Plot2</div>
    </>
  );
};

ProfilePlotSection.propTypes = {
  compound: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

export default ProfilePlotSection;
