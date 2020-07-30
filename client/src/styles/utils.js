import styled, { css } from 'styled-components';
import colors from './colors';

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    ${(props) => props.individual && css`
        & > * {
            width: 70%;
        }
    `}

    h1 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        font-size: calc(2vw + 1.5em);
        text-align: center;
        width: 100%;
    }

    h2 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        font-size: calc(0.25vw + 1.5em);
        text-align: center;
        width: 100%;
        margin-top: 5rem;
    }
`;

export default StyledWrapper;
