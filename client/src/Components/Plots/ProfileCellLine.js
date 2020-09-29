import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

const formatCellData = (experiments) => {
  console.log(experiments);
  const output = {};
  experiments.forEach((experiment) => {
    const { __typename, ...profile } = experiment.profile;
    const { cell_line, dataset } = experiment;
    if (!output[cell_line.name]) {
      output[cell_line.name] = {
        id: cell_line.id,
        name: cell_line.name,
        profiles: { [dataset.name]: profile },
      };
    } else {
      output[experiment.cell_line.name].profiles[experiment.dataset.name] = profile;
    }
  });
  return output;
};

const ProfileCellLine = (props) => {
  const { data } = props;

  const formattedData = useMemo(() => formatCellData(data), [data]);
  console.log(formattedData);
  return (<div>Profile Cell Line Plot</div>);
};

ProfileCellLine.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      cell_line: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        tissue: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      dataset: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      tissue: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      profile: PropTypes.shape({
        AAC: PropTypes.number,
        IC50: PropTypes.number,
      }).isRequired,
    }),
  ).isRequired,
};

export default ProfileCellLine;
