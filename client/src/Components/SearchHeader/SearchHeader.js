import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SlideDown } from 'react-slidedown';
import NavBar from './NavBar';
import SearchBar from './SearchBar';
import 'react-slidedown/lib/slidedown.css';

import bg from '../../images/bg.jpg';
import colors from '../../styles/colors';

const StyledSearchHeader = styled.div`
    height: ${(props) => (props.page === 'home' ? 'calc(30vh + 150px)' : 'auto')};
    background: ${(props) => (props.page === 'home' ? `url('${bg}')` : 'white')};
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    
    display:flex;
    flex-direction:column;

    .search-container {
        width: 70%;
        align-self:center;

        h1 {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
            margin:50px 0 20px 0;
        }
    }

    .dropdown {
      position: absolute;
      margin-top: 140px; // height + padding of navbar
      width: 70%;
      background: white;
      align-self:center;
      padding: 0px 30px;
      border-bottom:3px solid ${colors.light_blue_bg}
    }
`;
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
        <SlideDown className="dropdown">
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
