import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import Select, { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import createAllSubsets from '../../utils/createAllSubsets';
import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';
import defaultOptions from '../../utils/searchDefaultOptions';
import { searchQuery } from '../../queries/search';

// placeholders for react-select
const placeholders = [
  'Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
  'Compound (eg. paclitaxel)', 'Dataset (eg. ccle)',
  'Tissue vs Compound (eg. breast paclitaxel)',
  'Cell line vs Compound (eg. 22rv1 paclitaxel)',
  'Multiple datasets (eg. ccle, ctrpv2, gcsi)',
];

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
 * JSX for formatting the group header label
 * @param {Object} data contains react-select group label
 */
const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label.replace('_', ' ')}</span>
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
  const [options, setOptions] = useState(defaultOptions.options);

  const [searchedValue, updateSearchedValue] = useState('');

  // is all data loaded?
  const [isDataLoaded, setDataLoadedValue] = useState(false);

  // various states for select:
  // keyboard input in search bar, selected in search bar
  const [selectState, setSelectState] = useState({
    input: '',
    selected: [],
  });

  /**
   * Handles on enter button press to go to search results
   *
   * @param {Object} event key pressed
   */
  const handleKeyDown = (event) => {
    const { history } = props;
    const { selected } = selectState;
    let queryParams = '/';

    if (event.key === 'Enter' && selected.length !== 0) {
      const { type, value, label } = selected[0];
      if (selected.length === 1 && type === 'dataset_intersection') {
        const datasets = label.split(' ').join(',');
        queryParams = `/search?${type}=${datasets}`;
      } else if (selected.length === 1 && selected && label === value) {
        queryParams = `/${type}`;
      } else if (selected.length === 1 && selected && label !== value) {
        queryParams = `/${type}/${value}`;
      } else if (selected.length === 2 && selected && label !== value) {
        const selectedTypes = selected.map(el => el.type);
        if (selectedTypes.includes('tissues') && selectedTypes.includes('compounds')) {
          let tissue, compound = '';
          selected.forEach(el => {
            if (el.type === 'compounds') {
              compound = el.label;
            } else if (el.type === 'tissues') {
              tissue = el.label;
            }
          })
          queryParams = `/search?compound=${compound}&tissue=${tissue}`;
        } else if (selectedTypes.includes('cell_lines') && selectedTypes.includes('compounds')) {
          let cell, compound = '';
          selected.forEach(el => {
            if (el.type === 'compounds') {
              compound = el.label;
            } else if (el.type === 'cell_lines') {
              cell = el.label;
            }
          })
          queryParams = `/search?compound=${compound}&cell_line=${cell}`;
        }
        else if (selectedTypes.includes('genes') && selectedTypes.includes('compounds')) {
          let gene, compound = '';
          selected.forEach(el => {
            if (el.type === 'compounds') {
              compound = el.label;
            } else if (el.type === 'genes') {
              gene = el.label;
            }
          })
          queryParams = `/biomarker?compound=${compound}&gene=${gene}`;
        }
      } else if (selected.length === 3 && selected && label !== value) {
        const selectedTypes = selected.map(el => el.type);
        if (selectedTypes.includes('tissues') && selectedTypes.includes('compounds') && selectedTypes.includes('genes')) {
          let tissue, compound, gene = '';
          selected.forEach(el => {
            if (el.type === 'compounds') {
              compound = el.label;
            } else if (el.type === 'tissues') {
              tissue = el.label;
            } else if (el.type === 'genes') {
              gene = el.label;
            }
          })
          queryParams = `/biomarker?compound=${compound}&tissue=${tissue}&gene=${gene}`;
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
   * React-select filter option that filters based on
   * what the input starts with. Hopefully this will reduce the
   * amount of options returned
   *
   * @param {Object} option react-select option
   * @param {Str} rawInput input from the search bar
   */
  const customFilterOption = (option, rawInput) => {
    let returnObject = {};

    if (option.label && option.label !== 'null') {
      returnObject = option.label.toLowerCase().startsWith(rawInput.toLowerCase());
    }

    return returnObject;
  };

  /**
   * Creates the dataset intersection array.
   * @param {Array} - dataset array.
   * @returns {Array} - a dataset intersection array with all the subsets.
   */
  const createDatasetIntersections = (data) => {
    // datasets array.
    const datasets = data.map(el => el.name);
    // get all the subsets of the datasets array/set.
    const subsets = createAllSubsets(datasets).map((el, i) => {
      return {
        id: i,
        name: el.toString().replaceAll(',', ' '),
        __typename: 'dataset_intersection',
      }
    });

    // remove the elements with the set of lenght 0 or 1 from the subsets being an empty string.
    const finalSubsets = subsets.filter(el => el.name.split(' ').length > 1);

    return finalSubsets;
  }

  // const promiseOptions = (inputValue) => {
  //   console.log(inputValue);
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       call();
  //       resolve([{ value: 'ocean', label: 'Ocean'}]);
  //     }, 2000);
  //   });
  // }

  const [data] = useLazyQuery(searchQuery, {
    onCompleted: (data) => {
        console.log(data);
    },
    onError: (error) => {
        console.log(error);
    }
});

  const promiseOptions = (inputValue) => {
    console.log(data);
    const dataset = data({variables: {input: 'erb'}});
    console.log(dataset);
  }

  return (
    <>
      <AsyncSelect 
        placeholder={(
          <ReactTypingEffect
            speed="100"
            typingDelay="200"
            eraseDelay="1500"
            className="placeholder"
            text={placeholders}
          />
        )}
        defaultOptions={options}
        isMulti
        cacheOptions 
        loadOptions={promiseOptions} 
        styles={SearchBarStyles} 
        // onChange={handleChange}
        // onInputChange={handleInputChange}
        // onKeyDown={handleKeyDown}
        // onMenuClose={handleMenuClose}
        // menuIsOpen={menuOpen}
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
