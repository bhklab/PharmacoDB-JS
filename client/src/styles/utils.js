import styled from 'styled-components';
import colors from './colors';

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    & > * {
        width: 70%;
    }

    h1 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        font-size: calc(2vw + 1.5em);
        text-align:center;
        width:100%;
    }
`;

export default StyledWrapper;
