import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';

import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';

const CustomOption = (innerProps) => (
  <components.Option {...innerProps}>
    <div
      style={{
        backgroundColor: innerProps.isFocused ? colors.lightblue_bg : 'inherit',
        height: 40,
        padding: '13px 20px',
        '&:hover': {
          background: colors.lightblue_bg,
        },
      }}
    >
      <span>{innerProps.label}</span>
    </div>
  </components.Option>
);

const customFilterOption = (option, rawInput) => {
  const words = rawInput.split(' ');
  return words.reduce(
    (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
    true,
  );
};

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

  return (
    <Select
      isMulti
      filterOption={customFilterOption}
      // options={options}
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
      styles={SearchBarStyles}
      // onChange={handleChange}
      // onKeyDown={handleKeyDown}
      // onMenuOpen={handleMenuOpen}
      // onMenuClose={handleMenuClose}
    />
  );
};

export default SearchBar;
