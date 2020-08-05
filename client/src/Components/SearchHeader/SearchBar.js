import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { useQuery } from '@apollo/react-hooks';
import { getCompoundsQuery } from '../../queries/queries';

import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';

/** CONSTANTS */
// input must be greater than this length to
// display option menu
const INPUT_LENGTH_FOR_MENU = 2;
// placeholders for react-select
const placeholders = ['Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
  'Drug (eg. paclitaxel)', 'Dataset (eg. ccle)',
  'Tissue vs Drug (eg. breast paclitaxel)', 'Cell line vs Drug (eg. 22rv1 paclitaxel)',
  'Multiple datasets (eg. ccle, ctrpv2)',
];

/**
 * React-select filter option that filters based on
 * what the input starts with. Hopefully this will reduce the
 * amount of options returned
 *
 * @param {Object} option react-select option
 * @param {Str} rawInput input from the search bar
 */
const customFilterOption = (option, rawInput) => option.label.toLowerCase().startsWith(rawInput.toLowerCase());

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
  const [options, setOptions] = useState({
    list: [],
    loaded: {
      compounds: false,
    },
  });

  // input being entered - for determining the opening of option menu
  // only open option menu if input is a certain length
  const [input, setInput] = useState('');

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

  // Get compounds data
  const compoundsData = useQuery(getCompoundsQuery, {
    variables: { per_page: 10 },
  }).data;

  /**
   * On every update of each query returning data,
   * add all data that has returned to options.
   */
  useEffect(() => {
    if (compoundsData !== undefined) {
      const { compounds } = compoundsData;
      if (!options.loaded.compounds) {
        setOptions((prevOptions) => {
          prevOptions.list.push({
            label: 'Compounds',
            options: compounds.map((x) => ({ value: x.id, label: x.name })),
          });
          prevOptions.loaded.compounds = true;
          return prevOptions;
        });
      }
    }
  }, [compoundsData]);

  return (
    <>
      <Select
        isMulti
        filterOption={customFilterOption}
        options={Object.values(options.loaded) ? options.list : null}
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
        menuIsOpen={input.length >= INPUT_LENGTH_FOR_MENU}
      />
    </>
  );
};

export default SearchBar;
