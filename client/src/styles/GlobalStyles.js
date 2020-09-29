import { createGlobalStyle } from 'styled-components';
import colors from './colors';

const GlobalStyles = createGlobalStyle`
    body {
        margin:0;
        color: ${colors.dark_gray_text};
        font-family: 'Open Sans', sans-serif;
        font-weight: 400;
        font-size: calc(0.2vw + 11px);
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
    }
    .js-plotly-plot {
        width: 100%;
    }
    .noscroll
    {
        position: fixed; 
        overflow-y: scroll;
        width: 100%;
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
        font-size: calc(0.5vw + 1.8em);
    }

    // Seach Header visibility
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

    .blur {
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(5px);
        filter: blur(5px);
    }

    .burger-menu {
        position:fixed;
        h2 {
            margin-bottom: 10px;
        }
        .burger-item{ 
            border-left: 1px solid white;
            padding: 10px;
            margin-left: 5px;
            color: white;

            &:hover {
                border-left: 5px solid white;
            }
        }
        p {
            margin: 2em;
        }
    }

    .plot {
        margin-bottom: 20px;
    }
    /* desktop */
    @media only screen and (min-width: 1082px) { 
        .burger-menu, .bm-burger-button {
            display:none;
        }
    }
`;

// font-family: 'Nunito', sans-serif; 400, 600
// font-family: 'Open Sans', sans-serif; 400, 600
// font-family: 'Overpass', sans-serif; 400, 600
// font-family: 'Roboto Slab', serif; 600
// font-family: 'Rubik', sans-serif; 400, 500

export default GlobalStyles;
