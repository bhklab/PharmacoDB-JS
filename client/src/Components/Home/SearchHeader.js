import React from 'react';
import Navbar from './Navbar';
import PropTypes from 'prop-types';

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
        <div>{page}</div>
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