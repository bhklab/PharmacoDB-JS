import styled from 'styled-components';

import bg from '../images/bg.jpg';
import colors from './colors';

/**
 * Styles for the search header parent component.
 */
const StyledSearchHeader = styled.div`
    max-height: ${(props) => (props.page === 'home' ? 'calc(25vh + 150px)' : 'auto')};
    background: ${(props) => (props.page === 'home' ? `url('${bg}')` : 'white')};
    background-size: cover;
    background-attachment: fixed;
    background-position: center;
    
    display:flex;
    flex-direction:column;

    .search-container {
        width: 70%;
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
            font-size: calc(0.3vw + 0.8em);
        }
    }

    .popup {
        position:absolute;
        margin-top:100px; // height + padding of navbar
        background: rgb(255,255,255,0.8);
        z-index:999;
        height:100%;
        padding-top:50px;
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

    /* Burger */
    .burger-bg {
        position: fixed;
        width: 53px;
        height: 46px;
        right: 0;
        top: 36px;
        background: ${(props) => (props.page === 'home' ? colors.dark_teal_heading : 'white')};
        display:none;
        opacity:0.7;
        z-index:999;
    }
    /* mobile */
    @media only screen and (max-width: 1081px) {
        .header-links {
            display: none;
        }
        .burger-bg {
            display: block;
        }
    } 
`;

/**
 * Styles for the nav bar parent component.
 */
const StyledNavBar = styled.div`
    position: static;
    width: 100%;
    padding-top: 40px;
    height: 70px;
    margin-bottom: ${(props) => (props.page === 'home' ? 'auto' : '6vh')};
    
    display: flex;
    justify-content: center;

    .container {
        width: 85%;
        padding-bottom: 30px;
        border-bottom: ${(props) => (props.page === 'home' ? 'none' : `3px solid ${colors.light_blue_bg}`)};

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        width: calc(5vw + 150px);
        max-width: 200px;
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

    /* mobile */
    @media only screen and (max-width: 1081px) {
        width: auto;
    } 

    .link-dropdown, .link {
        width: auto;
        color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
        font-family: 'Rubik', sans-serif;
        font-weight: 400;
        font-size: calc(0.4vw + 0.9em);
        letter-spacing: 0.5px;
        background: transparent;
        border: none;
        padding: 13px 0;

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

    .dropdown.icon {
        margin-left: 0.5em !important;
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

    /* mobile */
    @media only screen and (max-width: 1081px) {
        width: 33px;
        height: 33px;
        img {
            width: 12px;
        }
    } 
  
`;

export {
  StyledSearchHeader,
  StyledSearchButton,
  StyledNavBar,
  StyledLinkDropdowns,
};