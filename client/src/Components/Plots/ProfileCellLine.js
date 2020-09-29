import React, { useState, useMemo, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import StyledSelectorContainer from '../../styles/Utils/StyledSelectorContainer';
import generateSelectOptions from '../../utils/generateSelectOptions';
import calculateMedian from '../../utils/calculateMedian';
import colors from '../../styles/colors';

const config = {
  responsive: true,
  displayModeBar: false,
};

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
const generateOptions = (data) => {
  const profileOptions = Object.keys(data[0].profile);
  const datasetOptions = [...new Set(data.map((el) => el.dataset.name)), 'All'];
  return [generateSelectOptions(profileOptions), generateSelectOptions(datasetOptions)];
};

const generatePlotData = (data, dataset, profile) => {
  console.log(data, dataset, profile);
  const plotData = [];
  data.forEach((el) => ({
    x: el.cell_line.name,
    // y:
  }));
  return {
    x: ['Trial 1', 'Trial 2', 'Trial 3'],
    y: [3, 6, 4],
    name: 'Control',
    error_y: {
      type: 'data',
      array: [1, null, 1.5],
      visible: [true, false, true],
    },
    type: 'bar',
  };
};

const ProfileCellLine = (props) => {
  const { data, compound } = props;
  const [selectedProfile, setSelectedProfile] = useState('AAC');
  const [selectedDataset, setSelectedDataset] = useState('All');
  const [plotData, setPlotData] = useState(generatePlotData(data, selectedDataset, selectedProfile));
  const [layout, setLayout] = useState({
    autoresize: true,
    height: 530,
    margin: {
      t: 20,
      b: 50,
      l: 65,
      r: 0,
    },
    xaxis: {
      color: colors.dark_teal_heading,
    },
    yaxis: {
      color: colors.dark_teal_heading,
    },
  });

  useEffect(() => {
    // changes layout when profile updates
  }, [selectedProfile]);
  const formattedData = useMemo(() => formatCellData(data), [data]);
  const [profileOptions, datasetOptions] = useMemo(() => generateOptions(data), [data]);
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
            onChange={(e) => setSelectedDataset(e.value)}
          />
        </div>
        <div className="selector-container">
          <h3>Select Profile </h3>
          <Select
            defaultValue={{ value: selectedProfile, label: selectedProfile }}
            options={profileOptions}
            onChange={(e) => setSelectedProfile(e.value)}
          />
        </div>
      </StyledSelectorContainer>
      <h4>
        {compound}
        ,
        {' '}
        {selectedProfile}
        {' '}
        {selectedDataset !== 'All' ? `(${selectedDataset})` : null}
      </h4>
      <Plot data={[plotData]} layout={layout} config={config} />
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
  compound: PropTypes.string.isRequired,
};

export default ProfileCellLine;
