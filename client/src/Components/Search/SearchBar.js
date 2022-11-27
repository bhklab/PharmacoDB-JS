import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import ReactTypingEffect from 'react-typing-effect';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import createAllSubsets from '../../utils/createAllSubsets';
import colors from '../../styles/colors';
import { SearchBarStyles } from '../../styles/SearchHeaderStyles';
import defaultOptions from '../../utils/searchDefaultOptions';
import { searchQuery } from '../../queries/search';
import containsAll from '../../utils/containsAll';
import debounce from 'lodash.debounce';
import MenuList from './List';

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

/**
 * Custom options for scrolling with keyboard
 */
const CustomOption = (innerProps) => {
  return (
    <components.Option {...innerProps}>
    <div
      style={{
        textAlign: 'left',
        fontWeight: innerProps.isDisabled ? '700' : '400',
        padding: '5px',
        color: innerProps.isDisabled ? colors.dark_blue : colors.dark_gray_text,
        cursor: innerProps.isDisabled ? 'not-allowed' : 'pointer',
        fontSize: innerProps.isDisabled ? '1.15em' : '1em',
        // background: innerProps.isDisabled ? colors.light_blue_bg : '',
      }}
    >
      {innerProps.label}
    </div>
  </components.Option>
  )
}

/**
 * 
 * @param {Array} data - input data
 * @returns {Array} - transformed data
 */
const transformData = (data) => {
  const transformedData = [];
  const typesVisited = [];

  data.forEach(el => {
    if(!typesVisited.includes(el.type)) {
      typesVisited.push(el.type);

      transformedData.push({
        value: `${el.type.toUpperCase().replace('_', ' ')}S`,
        label: `${el.type.toUpperCase().replace('_', ' ')}S`,
        type: 'data_type', 
        isDisabled: true
      });
    }

    transformedData.push({value: el.id, label: el.value, type: el.type});
  });

  return transformedData;
};

// function gets the data from search API based on the user input 
const getSelectionDataBasedOnInput = async (input) => {
  let finalResponse;

  // API request
  const data = await fetch('/graphql ', {
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
 * 
 * @param {Array} selection - array of selections
 * @returns {string} - redirect URL
 */
const createSingleSelectionURL = (selection) => {
  const {type, value, label} = selection[0];
  let url = '';

  // this is for dataset intersection (example searching for : ccle and fimm together)
  if (type === 'dataset_intersection') {
    const datasets = label.split(' ').join(',');
    url = `/search?${type}=${datasets}`;
  }

  // this is for cases like searching for cells, tissues, cell_line, compound etc as a string
  if (label === value) {
    url = `/${type}`;
  }

  // this is for single type search like genes/8228.
  if (label !== value) {
    url = `/${type}s/${value}`;
  }

  return url;
};

/**
 * 
 * @param {Array} selection - array of selections
 * @return {string} - URL string
 */
const createURLForTwoSelections = (selection) => {
  const selectedTypes = selection.map(el => el.type);
  let url = '';

  if (containsAll(selectedTypes, ['tissue', 'compound'])) {
    let tissue, compound = '';
    selection.forEach(el => {
      if (el.type === 'compound') {
        compound = el.label;
      } else if (el.type === 'tissue') {
        tissue = el.label;
      }
    })
    url = `/search?compound=${compound}&tissue=${tissue}`;
  } else if (containsAll(selectedTypes, ['cell_line', 'compound'])) {
    let cell_line, compound = '';
    selection.forEach(el => {
      if (el.type === 'compound') {
        compound = el.label;
      } else if (el.type === 'cell_line') {
        cell_line = el.label;
      }
    })
    url = `/search?compound=${compound}&cell_line=${cell_line}`;
  } else if (containsAll(selectedTypes, ['gene', 'compound'])) {
    let gene, compound = '';
    selection.forEach(el => {
      if (el.type === 'compound') {
        compound = el.label;
      } else if (el.type === 'gene') {
        gene = el.label;
      }
    })
    url = `/biomarker?compound=${compound}&gene=${gene}`;
  }
  
  return url;
};

/**
 * 
 * @param {Array} selection - array of selections
 * @return {string} - URL string
 */
const createURLForThreeSelections = (selection) => {
  // get the selected types list
  const selectedTypes = selection.map(el => el.type);
  let url = '';
  
  if (containsAll(selectedTypes, ['tissue', 'compound', 'gene'])) {
    let tissue, compound, gene = '';
    selection.forEach(el => {
      if (el.type === 'compound') {
        compound = el.label;
      } 
      if (el.type === 'tissue') {
        tissue = el.label;
      } 
      if (el.type === 'gene') {
        gene = el.label;
      }
    })
    url = `/biomarker?compound=${compound}&tissue=${tissue}&gene=${gene}`;
  }

  return url;
};

/**
 * @param {Array} selection - an array of objects (selections from the select)
 */
const createRedirectURL = (selection) => {
  // selection length
  const selectionLength = selection.length; 
  // final url
  let url = ''; 

  switch(selectionLength) {
    case 1:
      url = createSingleSelectionURL(selection);
      break;

    case 2:
      url = createURLForTwoSelections(selection);
      break;

    case 3: 
      url = createURLForThreeSelections(selection);
      break;
  }

  return url;
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
    let queryParams = '/';

    if (event.key === 'Enter' && !isMenuOpen && selectedElement.length !== 0) {
      // creating URL
      queryParams = createRedirectURL(selectedElement);
      
      // reset react-select
      setSelectedElementState([]);

      // go to endpoint
      history.push(queryParams);
    }
  };

  // handles menu close
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  // Handles the option selected in the input.
  const handleChange = (event) => {
    // set the state
    setSelectedElementState(event);
    // also revert open menu to false because option selected
    setIsMenuOpen(false);
  };

  // Handles keypresses or any other changes in the input.
  const handleInputChange = (event) => {
    // also make sure menu doesn't open on click until type
    setIsMenuOpen(event.length >= INPUT_LENGTH_FOR_MENU);
  };

  // to get the options from the API
  const selectionOptions = debounce((query, callback) => {
    getSelectionDataBasedOnInput(query)
      .then(response => callback(response));
  }, 1000);
  

  return (
    <>
      <AsyncSelect 
        components={{
          MenuList: (props) => (<MenuList {...props} />),
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
