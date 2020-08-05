import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { useQuery } from '@apollo/react-hooks';
import { getCompoundsQuery } from '../../queries/compound';

import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';

/**
 * React-select filter option
 */
const customFilterOption = (option, rawInput) => {
  const words = rawInput.split(' ');
  return words.reduce(
    (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
    true,
  );
};

/**
 * Reduce lag in react-select
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
 * Format the group header label
 */
const groupStyles = {
  fontSize: '1.5em',
  padding: '5px',
};

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
  const placeholders = ['Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
    'Drug (eg. paclitaxel)', 'Dataset (eg. ccle)',
    'Tissue vs Drug (eg. breast paclitaxel)', 'Cell line vs Drug (eg. 22rv1 paclitaxel)',
    'Multiple datasets (eg. ccle, ctrpv2)'];

  const [options, setOptions] = useState({
    list: [],
    loaded: {
      compounds: false,
    },
  });

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
            eraseDelay="1000"
            className="placeholder"
            text={placeholders}
          />
       )}
        formatGroupLabel={formatGroupLabel}
        styles={SearchBarStyles}
      />
    </>
  );
};

export default SearchBar;
