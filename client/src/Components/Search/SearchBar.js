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

// input must be greater than this length to display option menu
const INPUT_LENGTH_FOR_MENU = 1;

// placeholders for react-select
const placeholders = [
  'Cell line (eg. 22rv1)', 'Tissue (eg. endometrium)',
  'Compound (eg. paclitaxel)', 'Dataset (eg. ccle)',
  'Tissue vs Compound (eg. breast paclitaxel)',
  'Cell line vs Compound (eg. 22rv1 paclitaxel)',
  'Multiple datasets (eg. ccle, ctrpv2, gcsi)',
];

// transform data to react-select input format
const transformData = (data) => {
  return data.map(el => ({
    value: el.id,
    label: el.value,
    type: el.type,
  }))
};

// function gets the data from search API based on the user input 
const getSelectionDataBasedOnInput = async (input) => {
  let finalResponse;

  // API request
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

  // prepare response
  await data
    .json()
    .then(response => {
      return response;
    })
    .then(response => {
      finalResponse = transformData(response.data.search);
    })
    .catch(err => console.log('an error occurred while making an API request', err));

    return finalResponse;
};


/**
 * Component for the search bar.
 * @component - Search Bar component
 */
const SearchBar = (props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedElement, setSelectedElementState] = useState([]);

  /**
   * Handles on enter button press to go to search results
   * @param {Object} event key pressed
   */
  const handleKeyDown = (event) => {
    const { history } = props;
    const selected = selectedElement;

    let queryParams = '/';

    if (event.key === 'Enter' && !isMenuOpen && selected.length !== 0) {
      const { type, value, label } = selected[0];

      if (selected.length === 1 && type === 'dataset_intersection') {
        const datasets = label.split(' ').join(',');
        queryParams = `/search?${type}=${datasets}`;
      } else if (selected.length === 1 && selected && label === value) {
        queryParams = `/${type}`;
      } else if (selected.length === 1 && selected && label !== value) {
        queryParams = `/${type}s/${value}`;
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

      // reset react-select
      setSelectedElementState({ ...selectedElement, selected: null });

      // go to endpoint
      history.push(queryParams);
    }
  };

  // handles menu close
  const handleMenuClose = () => {
    console.log('MenuClose', isMenuOpen);
    setIsMenuOpen(false);
  };

  /**
   * Handles the option selected in the input.
   *
   * @param {Object} event the option selected
   */
  const handleChange = (event) => {
    setSelectedElementState(...selectedElement, event);

    // also revert open menu to false because option selected
    setIsMenuOpen(false);
  };

  /**
   * Handles keypresses or any other changes in the input.
   *
   * @param {Object} event the current value of the input
   */
  const handleInputChange = (event) => {
    // also make sure menu doesn't open on click until type
    setIsMenuOpen(event.length >= INPUT_LENGTH_FOR_MENU);
  };

  // function creates a promise that resolves to the selection data
  const selectionOptions = (input) => {
    return new Promise((resolve) => setTimeout(() =>  
      getSelectionDataBasedOnInput(input).then(response => resolve(response)), 1000)
    );
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
        // defaultOptions={defaultOptions.options}
        isMulti
        cacheOptions 
        loadOptions={selectionOptions} 
        onKeyDown={handleKeyDown}
        styles={SearchBarStyles}
        noOptionsMessage={()=>"name not found"} 
        onChange={handleChange}
        onInputChange={handleInputChange}
        onMenuClose={handleMenuClose}
        menuIsOpen={isMenuOpen}
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
};

export default withRouter(SearchBar);
