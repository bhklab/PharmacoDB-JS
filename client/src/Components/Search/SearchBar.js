import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import ReactTypingEffect from 'react-typing-effect';
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

  const [options, setOptions] = useState(defaultOptions.options);

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

  const promiseOptions = (input) => {
    return new Promise((resolve) => {
        setTimeout(async () => {
          const data = await fetch('http://localhost:5000/graphql ', {
            method: 'post',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              query: searchQuery,
              variables: {input},
            })
          });
          data.json().then(result => resolve([{value: result.data.search[0].value, label: result.data.search[0].value}]));
        }, 1000);
    });
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
        onKeyDown={handleKeyDown}
        styles={SearchBarStyles}
        noOptionsMessage={()=>"name not found"} 
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
