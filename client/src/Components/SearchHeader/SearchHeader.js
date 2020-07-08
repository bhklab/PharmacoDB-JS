import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SlideDown } from 'react-slidedown';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import 'react-slidedown/lib/slidedown.css';

import { StyledSearchHeader } from './SearchHeaderStyles';

/**
 * Header component including the navbar and the
 * search bar. Is full size on home page, and minimized
 * on any other page (based on the page prop).
 *
 * @component
 * @example
 *
 * const page = "home"
 * return (
 *   <SearchHeader page={page}/>
 * )
 */
const SearchHeader = (props) => {
  const { page } = props;
  const [isOpen, setIsOpen] = useState(false);

  /**
   * On click handler - handles closing and opening of search.
   *
   * @param {Object} e  on click event
   */
  const onClick = (e) => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <StyledSearchHeader page={page}>
      <NavBar page={page} onClick={onClick} />
      { page === 'home' ? (
        <div className="search-container">
          <h1>Try searching for a...</h1>
          <SearchBar page={page} />
        </div>
      ) : (
        <SlideDown className="search-dropdown">
          {isOpen ? (
            <div className="search-container">
              <h1>Try searching for a...</h1>
              <SearchBar page={page} />
            </div>
          ) : null}
        </SlideDown>
      )}
    </StyledSearchHeader>
  );
};

SearchHeader.propTypes = {
  /**
     * SearchHeader's page name
     */
  page: PropTypes.string,
};

SearchHeader.defaultProps = {
  page: '',
};

export default SearchHeader;
