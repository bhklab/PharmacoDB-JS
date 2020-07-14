import styled from 'styled-components';

import bg from '../images/bg.jpg';
import colors from './colors';

/**
 * Styles for the search header parent component.
 */
const StyledSearchHeader = styled.div`
    // height: ${(props) => (props.page === 'home' ? 'calc(25vh + 150px)' : 'auto')};
    background: ${(props) => (props.page === 'home' ? `url('${bg}')` : 'white')};
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    
    display:flex;
    flex-direction:column;

    .search-container {
        width: ${(props) => (props.page === 'home' ? '70%' : '100%')};
        margin-top: 4vh;
        padding-bottom: 5vh;
        align-self:center;

        h1 {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
            margin-bottom: 20px;
        }

        span {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
            margin-bottom: 20px;
            font-size: 1.2em;
        }
    }

    .search-dropdown {
      position: absolute;
      margin-top: 110px; // height + padding of navbar
      width: 70%;
      background: white;
      align-self:center;
      padding: 0px 30px;
      border-bottom:3px solid ${colors.light_blue_bg};
      z-index:999;
    }
`;

/**
 * Styles for the nav bar parent component.
 */
const StyledNavBar = styled.div`
    position: static;
    width: 100%;
    padding-top: 60px;
    height: 70px;
    
    display: flex;
    justify-content: center;

    .container {
        width: 70%;
        padding-bottom: 30px;
        border-bottom: ${(props) => (props.page === 'home' ? 'none' : `3px solid ${colors.light_blue_bg}`)};

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        width: 200px;
    }
`;

/**
 * Styles for the dropdowns in the navbar component.
 */
const StyledLinkDropdowns = styled.div`
    width: ${(props) => (props.page === 'home' ? '30%' : '40%')};
    display: flex;
    justify-content: space-between;
    align-items: center;

    .link-dropdown, .link {
        width: auto;
        color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
        font-family: 'Rubik', sans-serif;
        font-weight: 400;
        font-size: calc(0.4vw + 0.9em);
        letter-spacing: 0.5px;
        background: transparent;
        border: none;
        padding: 13px 0px;

        a {
            color: ${colors.dark_teal_heading};
            font-size: calc(0.3vw + 0.8em);
            text-align:left;
        }
    }
    
    .link-menu {
        margin-top:0px !important;

        .item {
            margin: 10px 0px;
        }
    }
`;

/**
 * Styles for the search button in the nav bar component.
 */
const StyledSearchButton = styled.button`
    border-radius:50%;
    width: 40px;
    height: 40px;
    background: ${colors.light_blue_bg};
    display:flex;
    justify-content: center;
    align-items:center;
    cursor: pointer;
    border: none;

    img {
      width:15px;
    }
    
    &:focus {
      outline:0;
    }
  
`;

export {
  StyledSearchHeader,
  StyledSearchButton,
  StyledNavBar,
  StyledLinkDropdowns,
};
