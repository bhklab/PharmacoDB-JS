import React from 'react';
import styled from 'styled-components';

import colors from '../../styles/colors';

const TempBar = styled.div`
    width: 100%;
    background: rgb(233, 245, 255, 0.8);
    border-radius: 40px;
    height: 70px;
`;

const SearchBar = () => {
    return <TempBar />;
};

export default SearchBar;
