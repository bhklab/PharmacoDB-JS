import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const GlobalStyles = createGlobalStyle`
    body {
        margin:0;
        color: ${colors.dark_gray_text};
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
    }

    a {
        text-decoration: none;
        transition: all 0.25s ease-out 0s;
    }
    a:hover {
        transition: all 0.25s ease-out 0s;
    }

    h1, h2, h3 {
        margin:0;
    }

    h1 {
        font-size: calc(0.5vw + 2em);
    }

    .visible {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.25s linear;
    }
    
    .hidden {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 0.25s, opacity 0.25s linear;
    }
`;

// font-family: 'Nunito', sans-serif; 400, 600
// font-family: 'Open Sans', sans-serif; 400, 600
// font-family: 'Overpass', sans-serif; 400, 600
// font-family: 'Roboto Slab', serif; 600
// font-family: 'Rubik', sans-serif; 400, 500

export default GlobalStyles;
