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

    h1, h2, h3 {
        color: ${colors.dark_teal_heading};
        font-family: 'Roboto Slab', serif;
        text-align: center;
        width: 100%;
    }

    h1 {
        font-size: calc(2vw + 1.5em);
    }

    h2 {
        font-size: calc(1vw + 1.5em);
        margin-top: 2rem;
    }

    h3 {
        font-size: calc(0.25vw + 1.5em);
        margin-top: 2rem;
    }
`;

export default StyledWrapper;
