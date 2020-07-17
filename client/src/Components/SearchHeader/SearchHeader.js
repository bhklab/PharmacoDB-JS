import React, { useState, useContext } from 'react';
import { SlideDown } from 'react-slidedown';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import 'react-slidedown/lib/slidedown.css';
import PageContext from '../../context/PageContext';

import { StyledSearchHeader } from '../../styles/SearchHeaderStyles';

/**
 * Header component including the navbar and the
 * search bar. Is full size on home page, and minimized
 * on any other page (based on the page prop).
 *
 * @component
 * @example
 *
 * return (
 *   <SearchHeader />
 * )
 */
const SearchHeader = () => {
  const page = useContext(PageContext);
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
    <StyledSearchHeader page={page} isOpen={isOpen}>
      <NavBar onClick={onClick} />
      { page === 'home' ? (
        <div className="search-container">
          <h1>Try searching for a...</h1>
          <SearchBar />
          <span>Example: &nbsp;&nbsp;paclitaxel &nbsp;&nbsp;•&nbsp;&nbsp; 22rv1 &nbsp;&nbsp;•&nbsp;&nbsp; mcf7 paclitaxel</span>
        </div>
      ) : (
      // <SlideDown className="search-dropdown">
      //   {isOpen ? (
      //     <div className="search-container">
      //       <h1>Try searching for a...</h1>
      //       <SearchBar />
      //       <span>Example: &nbsp;&nbsp;paclitaxel &nbsp;&nbsp;•&nbsp;&nbsp; 22rv1 &nbsp;&nbsp;•&nbsp;&nbsp; mcf7 paclitaxel</span>
      //     </div>
      //   ) : null}
      // </SlideDown>

        <div className={`search-container popup ${isOpen ? 'visible' : 'hidden'}`}>
          <h1>Try searching for a...</h1>
          <SearchBar />
          <span>Example: &nbsp;&nbsp;paclitaxel &nbsp;&nbsp;•&nbsp;&nbsp; 22rv1 &nbsp;&nbsp;•&nbsp;&nbsp; mcf7 paclitaxel</span>
        </div>
      )}
    </StyledSearchHeader>
  );
};

export default SearchHeader;
