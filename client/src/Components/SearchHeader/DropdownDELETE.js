import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SlideDown } from 'react-slidedown';
import SearchBar from './SearchBar';
import 'react-slidedown/lib/slidedown.css';

import colors from '../../styles/colors';

const StyledSearchContainer = styled.div`
    width: 70%;
    margin: auto;

    h1 {
        font-family: 'Overpass', sans-serif;
        font-weight: 400;
        color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
        margin:30px 0 20px 0;
    }
    
`;
/**
 * Dropdown menu component containing search bar.
 *
 * @component
 * @example
 *
 * const isOpen = true;
 * return (
 *   <Dropdown isOpen={isOpen}/>
 * )
 */
const Dropdown = (props) => {
  const { isOpen } = props;
  return (
    <SlideDown className="dropdown">
      {isOpen ? (
        <StyledSearchContainer>
          <h1>Try searching for a...</h1>
          <SearchBar />
        </StyledSearchContainer>
      ) : null}
    </SlideDown>

  );
};

Dropdown.propTypes = {
  /**
     * Dropdown's open trigger
     */
  isOpen: PropTypes.bool,
};

Dropdown.defaultProps = {
  isOpen: false,
};

export default Dropdown;
