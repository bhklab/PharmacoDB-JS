import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { useQuery } from '@apollo/react-hooks';
import { getCompoundsQuery } from '../../queries/compound';
import { getTissuesQuery } from '../../queries/tissue';
import { getCellLinesQuery } from '../../queries/cell';
import MenuList from './MenuList';

import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';

/** CONSTANTS */
// input must be greater than this length to
// display option menu
const INPUT_LENGTH_FOR_MENU = 1;
// placeholders for react-select
const placeholders = ['Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
  'Drug (eg. paclitaxel)', 'Dataset (eg. ccle)',
  'Tissue vs Drug (eg. breast paclitaxel)', 'Cell line vs Drug (eg. 22rv1 paclitaxel)',
  'Multiple datasets (eg. ccle, ctrpv2)',
];

/**
 * Custom options to reduce lag in react-select
 */
const CustomOption = (props) => {
  const { innerProps, isFocused, ...otherProps } = props;
  const { onMouseMove, onMouseOver, ...otherInnerProps } = innerProps;
  const newProps = { innerProps: { ...otherInnerProps }, ...otherProps };
  return (
    <components.Option {...newProps} className="your-option-css-class">
      {props.children}
    </components.Option>
  );
};

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
 *
 * return (
 *   <SearchBar />
 * )
 */
const SearchBar = () => {
  /** SETTING STATE */
  // all options available - sent to react-select
  const [options, setOptions] = useState([]);

  // entirety of data
  const [data, setData] = useState({
    compounds: [],
    tissues: [],
    'cell lines': [],
  });
  const [dataLoaded, setDataLoaded] = useState({
    compounds: false,
    tissues: false,
    'cell lines': false,
  });

  // input being entered - for determining the opening of option menu
  // only open option menu if input is a certain length
  const [input, setInput] = useState('');

  // Determine if select is done filtering to show/unshow loading
  const [selectLoading, setSelectLoading] = useState(false);

  /** HANDLERS */
  /**
   * Handles the option selected in the input.
   *
   * @param {Object} event the option selected
   */
  const handleChange = (event) => {
    console.log(event);
  };

  /**
   * Handles keypresses or any other changes in the input.
   *
   * @param {Object} event the current value of the input
  */
  const handleInputChange = (event) => {
    setInput(event);
  };

  /**
   * React-select filter option that filters based on
   * what the input starts with. Hopefully this will reduce the
   * amount of options returned
   *
   * @param {Object} option react-select option
   * @param {Str} rawInput input from the search bar
   */
  const customFilterOption = (option, rawInput) => {
    setSelectLoading(true);
    const filtered = option.label.toLowerCase().startsWith(rawInput.toLowerCase());
    setSelectLoading(false);
    return filtered;
  };

  /** DATA LOADING */
  /** Can't run hooks in a loop, so must do manually */
  const compoundsData = useQuery(getCompoundsQuery).data;
  const tissuesData = useQuery(getTissuesQuery).data;
  const cellsData = useQuery(getCellLinesQuery).data;

  /**
   * Load data in
   */
  useEffect(() => {
    setData({
      ...data,
      compounds: compoundsData ? compoundsData.compounds : [],
      tissues: tissuesData ? tissuesData.tissues : [],
      'cell lines': cellsData ? cellsData.cell_lines : [],
    });
    setDataLoaded({
      compounds: !!compoundsData,
      tissues: !!tissuesData,
      'cell lines': !!cellsData,
    });
  }, [compoundsData, tissuesData, cellsData]);

  useEffect(() => {
    // if all values of loaded are true
    if (Object.values(dataLoaded).every((x) => x)) {
      // for every datatype, push the options
      Object.keys(data).forEach((d) => {
        setOptions((prevOptions) => {
          prevOptions.push({
            label: d,
            options: data[d].map((x) => ({ value: x.id, label: x.name })),
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
        formatGroupLabel={formatGroupLabel}
        styles={SearchBarStyles}
        onChange={handleChange}
        onInputChange={handleInputChange}
        isLoading={selectLoading}
        menuIsOpen={input.length >= INPUT_LENGTH_FOR_MENU}
      />
    </>
  );
};

export default SearchBar;
