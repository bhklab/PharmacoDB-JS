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
    }

    h1, h2, h3 {
        margin:0;
    }

    h1 {
        font-size: calc(0.5vw + 2em);
    }
`;

// font-family: 'Nunito', sans-serif; 400, 600
// font-family: 'Open Sans', sans-serif; 400, 600
// font-family: 'Overpass', sans-serif; 400, 600
// font-family: 'Crete Round', serif;
// font-family: 'Rubik', sans-serif; 400, 500

export default GlobalStyles;