import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import bg from '../../images/bg.jpg';
import colors from '../../styles/colors';

const StyledSearchHeader = styled.div`
    height: 45vh;
    background: ${colors.light_blue_header};
    background: url('${bg}');
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    
    display:flex;
    flex-direction:column;

    .search-container {
        width: 70%;
        margin: auto;

        h1 {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${colors.light_blue_header};
            margin-bottom:20px;
        }
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
    const { page } = props; // check if page is empty and === "home"
    return (
        <StyledSearchHeader>
            <Navbar/>
            <div className="search-container">
                <h1>Try searching for a...</h1>
                <SearchBar/>
            </div>
        </StyledSearchHeader>
    )
};

SearchHeader.propTypes = {
    /**
     * SearchHeader's page name
     */
    page: PropTypes.string.isRequired,
};
  
SearchHeader.defaultProps = {
    page: ''
};

export default SearchHeader;