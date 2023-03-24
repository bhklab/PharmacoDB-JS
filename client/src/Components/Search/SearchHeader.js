import React, { useState, useContext } from 'react';
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
    <StyledSearchHeader page={page}>
      <div className="burger-bg" />
      <NavBar onClick={onClick} popupVisible={isOpen} />
      {/* 
        The search bar is rendered for the home page only, to avoid other pages from stalling.
        Ternaries determine the classes to put based on if the page is home or not, and if the popup
        should be visible or not based on search button click. 
      */}
      {
        page === 'home' &&
        <div className={`search-container${page === 'home' ? '' : ` popup ${isOpen ? 'visible' : 'hidden'}`}`}>
          <h1>Try searching for a...</h1>
          <SearchBar onClick={onClick} />
          <span className="example">
            <span> Example: </span>
            <span> <a className={page === 'home' ? 'home-link' : ''} href='/compounds/PDBC00058'>paclitaxel</a> </span>
            <span> • </span>
            <span> <a className={page === 'home' ? 'home-link' : ''} href='/cell_lines/22RV1_12_2019'>22rv1</a> </span>
            <span> • </span>
            <span> <a className={page === 'home' ? 'home-link' : ''} href='/search?compound=paclitaxel&cell_line=mcf-7'>mcf7 paclitaxel</a> </span>
          </span>
        </div>
      }
    </StyledSearchHeader>
  );
};

export default SearchHeader;
