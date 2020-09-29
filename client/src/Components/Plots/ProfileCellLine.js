import React, { useState, useMemo, useQuery } from 'react';
import Plot from 'react-plotly.js';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import StyledSelectorContainer from '../../styles/Utils/StyledSelectorContainer';
import { getDatasetsQuery } from '../../queries/dataset';
import SelectOptions from '../Utils/SelectOptions';

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

/**
 *
 * @param {Array} data - experiments data from the API call
 * @returns {Array} - returns an array of profile and dataset options respectively that can be used by react-select
 * @example
 * return [[{value: 'CCLE', label: 'CCLE'}, ...],[...]]
 */
const generateSelectOptions = (data) => {
  const profileOptions = Object.keys(data[0].profile);
  const datasetOptions = [...new Set(data.map((el) => el.dataset.name)), 'All'];
  return [SelectOptions(profileOptions), SelectOptions(datasetOptions)];
};

const ProfileCellLine = (props) => {
  const { data } = props;
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');

  const formattedData = useMemo(() => formatCellData(data), [data]);
  const [profileOptions, datasetOptions] = useMemo(() => generateSelectOptions(data), [data]);
  console.log(profileOptions, datasetOptions);
  console.log(formattedData);
  return (
    <div className="plot">
      <StyledSelectorContainer>
        <div className="selector-container">
          <h3>Select Dataset </h3>
          <Select
            defaultValue={{ value: selectedDataset, label: selectedDataset }}
            options={datasetOptions}
            // components={{ Option: CustomOption }}
            // styles={customStyles}
            // onChange={handleDoseChange}
          />
        </div>
        <div className="selector-container">
          <h3>Select Profile </h3>
          <Select
            defaultValue={{ value: selectedProfile, label: selectedProfile }}
            options={profileOptions}
          />
        </div>
      </StyledSelectorContainer>
      <div>Profile Plot</div>
    </div>
  );
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
