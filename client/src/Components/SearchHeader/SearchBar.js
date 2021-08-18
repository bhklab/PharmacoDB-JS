import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCompoundsQuery } from '../../queries/compound';
import { getTissuesQuery } from '../../queries/tissue';
import { getCellLinesQuery } from '../../queries/cell';
import { getDatasetsQuery } from '../../queries/dataset';
import MenuList from './MenuList';

import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';

/** CONSTANTS */
// input must be greater than this length to
// display option menu
const INPUT_LENGTH_FOR_MENU = 1;

// placeholders for react-select
const placeholders = [
  'Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
  'Drug (eg. paclitaxel)', 'Dataset (eg. ccle)',
  'Tissue vs Drug (eg. breast paclitaxel)',
  'Cell line vs Drug (eg. 22rv1 paclitaxel)',
  'Multiple datasets (eg. ccle, ctrpv2, gcsi)',
];

/**
 * Custom options for scrolling with keyboard
 */
const CustomOption = (innerProps) => (
  <components.Option {...innerProps}>
    <div
      style={{
        textAlign: 'left',
        fontWeight: '400',
        color: colors.dark_gray_text,
        cursor: 'pointer',
        padding: '15px 25px',
        fontSize: '1em',
        fontFamily: "'Open Sans', sans-serif",
        backgroundColor: innerProps.isFocused ? colors.light_blue_bg : 'inherit',
      }}
    >
      {innerProps.label}
    </div>
  </components.Option>
);

/**
 * Styles for formatting the group header label
 */
const groupStyles = {
  fontSize: '1.5em',
  padding: '5px',
  textTransform: 'capitalize',
  color: colors.dark_teal_heading,
  fontWeight: 600,
};

/**
 * JSX for formatting the group header label
 * @param {Object} data contains react-select group label
 */
const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);

/**
 * Component for the search bar.
 *
 * @component
 * @example
 *
 * const onClick = (e) => {};
 * return (
 *   <SearchBar onClick={onClick} />
 * )
 */
const SearchBar = (props) => {
  const { onClick } = props;
  /** SETTING STATE */
  // all options available - sent to react-select
  const [options, setOptions] = useState([]);

  // entirety of data
  const [data, setData] = useState({
    compounds: [],
    tissues: [],
    cell_lines: [],
    datasets: [],
  });
  const [dataLoaded, setDataLoaded] = useState({
    compounds: false,
    tissues: false,
    cell_lines: false,
    datasets: false,
  });

  // various states for select:
  // keyboard input in search bar, selected in search bar
  const [selectState, setSelectState] = useState({
    input: '',
    selected: [],
  });

  // for menu being open or closed
  // IMPORTANT: don't merge into above state, because
  // above state cannot have multiple properties changed
  // at the same time
  const [menuOpen, setMenuOpen] = useState(false);

  /** HANDLERS */
  /**
   * Handles the option selected in the input.
   *
   * @param {Object} event the option selected
   */
  const handleChange = (event) => {
    setSelectState({ ...selectState, selected: event });
    // also revert open menu to false because option selected
    setMenuOpen(false);
  };

  /**
   * Handles keypresses or any other changes in the input.
   *
   * @param {Object} event the current value of the input
   */
  const handleInputChange = (event) => {
    setSelectState({
      ...selectState,
      input: event,
    });
    // also make sure menu doesn't open on click until type
    setMenuOpen(event.length >= INPUT_LENGTH_FOR_MENU);
  };

  /**
   * Handles on enter button press to go to search results
   *
   * @param {Object} event key pressed
   */
  const handleKeyDown = (event) => {
    const { history } = props;
    const { selected } = selectState;
    if (event.key === 'Enter' && !menuOpen && selected.length !== 0) {
      let queryParams = '/';
      if (selected.length === 1) {
        queryParams = `/${selected[0].type}/${selected[0].value}`;
      } else {
        // TODO: multiple queries
        for (let i = 1; i < selected.length; i += 1) {
          queryParams = queryParams.concat();
        }
      }
      // calls callback to hide popup in searchheader
      onClick(false);

      // reset react-select
      setSelectState({ ...selectState, selected: null });

      // go to endpoint
      history.push(queryParams);
    }
  };

  /**
   * Handles menu close
   */
  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  /**
   * React-select filter option that filters based on
   * what the input starts with. Hopefully this will reduce the
   * amount of options returned
   *
   * @param {Object} option react-select option
   * @param {Str} rawInput input from the search bar
   */
  const customFilterOption = (option, rawInput) => option.label.toLowerCase().startsWith(rawInput.toLowerCase());

  /** DATA LOADING */
  /** Can't run hooks in a loop, so must do manually */
  const compoundsData = useQuery(getCompoundsQuery).data;
  const tissuesData = useQuery(getTissuesQuery).data;
  const cellsData = useQuery(getCellLinesQuery).data;
  const datasetsData = useQuery(getDatasetsQuery).data;

  /**
   * Load data in
   */
  useEffect(() => {
    setData({
      ...data,
      compounds: compoundsData ? compoundsData.compounds : [],
      tissues: tissuesData ? tissuesData.tissues : [],
      cell_lines: cellsData ? cellsData.cell_lines : [],
      datasets: datasetsData ? datasetsData.datasets : [],
    });
    setDataLoaded({
      compounds: !!compoundsData,
      tissues: !!tissuesData,
      cell_lines: !!cellsData,
      datasets: !!datasetsData,
    });
  }, [compoundsData, tissuesData, cellsData, datasetsData]);

  useEffect(() => {
    // if all values of loaded are true
    if (Object.values(dataLoaded).every((x) => x)) {
      // for every datatype, push the options into groups
      Object.keys(data).forEach((d) => {
        setOptions((prevOptions) => {
          prevOptions.push({
            label: d,
            options: data[d].map((x) => ({ value: x.id, label: x.name, type: d })),
          });
          return prevOptions;
        });
      });
    }
  }, [data]);

  return (
    <>
      <Select
        isMulti
        filterOption={customFilterOption}
        options={options}
        components={{
          // MenuList: (props) => (<MenuList {...props} />),
          Option: CustomOption,
        }}
        placeholder={(
          <ReactTypingEffect
            speed="100"
            typingDelay="200"
            eraseDelay="1500"
            className="placeholder"
            text={placeholders}
          />
        )}
        value={selectState.selected}
        formatGroupLabel={formatGroupLabel}
        styles={SearchBarStyles}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onMenuClose={handleMenuClose}
        menuIsOpen={menuOpen}
      />
    </>
  );
};

SearchBar.propTypes = {
  /**
   * for going to endpoint
   */
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  /**
   * onClick handler for closing and opening search
   */
  onClick: PropTypes.func.isRequired,
};

export default withRouter(SearchBar);
