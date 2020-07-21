import React from 'react';
import styled from 'styled-components';

import colors from '../../styles/colors';

const TempBar = styled.div`
    width: 100%;
    background: rgb(233, 245, 255, 0.8);
    border-radius: 40px;
    height: 5.5vh;
    min-height: 40px;
    margin-bottom:20px;
`;

/**
 * Component for the search bar.
 *
 * @component
 * @example
 *
 *
 * return (
 *   <SearchBar />
 * )
 */
const SearchBar = () => (
  <TempBar className="search-bar" />
);

export default SearchBar;
