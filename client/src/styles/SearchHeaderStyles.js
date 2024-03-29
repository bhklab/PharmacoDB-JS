import styled from 'styled-components';

import bg from '../images/bg.webp';
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
        width: 80%;
        margin-top: 4vh;
        padding-bottom: 5vh;
        align-self:center;

        @media only screen and (max-width: 1081px) {
          width: 90%;
        }

        h1 {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
            margin-bottom: 20px;
        }

        .example {
            font-family: 'Overpass', sans-serif;
            font-weight: 400;
            color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
            margin-bottom: 20px;
            font-size: calc(0.3vw + 0.8em);
            span {
              margin-left: 5px;
            }
            .home-link {
              color: ${colors.light_blue};
            }
            .home-link:hover {
              color: ${colors.pale_teal};
            }
        }
        
        // Search bar placeholder
        .placeholder {
          color: #868d8f !important;
          font-family: 'Rubik', sans-serif !important;
        }
    }

    .popup {
        position:absolute;
        margin-top:100px; // height + padding of navbar
        background: rgb(255,255,255,0.7);
        z-index:999;
        height:100vh;
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
        width: 45px;
        height: 35px;
        right: 0;
        top: 10px;
        background: ${(props) => (props.page === 'home' ? colors.dark_teal_heading : colors.light_blue_bg)};
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
    height: clamp(50px, calc(4vw + 5px), 70px);
    margin-bottom: ${(props) => (props.page === 'home' ? 'auto' : '30px')};
    
    display: flex;
    justify-content: center;

    .container {
        font-size: clamp(14px, calc(1vw + 2px), 18px);
        width: 85%;
        border-bottom: ${(props) => (props.page === 'home' ? 'none' : `3px solid ${colors.light_blue_bg}`)};

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .logo {
        width: calc(5vw + 150px);
        max-width: 200px;
        padding-top: 5px;
    }
    /* mobile */
    @media only screen and (max-width: 1081px) {
        .container {
          width: 80%;
          justify-content: flex-start;
        }
        .search-button {
          margin-left: 20px;
        }
    } 
`;

/**
 * Styles for the dropdowns in the navbar component.
 */
const StyledLinkDropdowns = styled.div`
    width: ${(props) => (props.page === 'home' ? '40%' : '45%')};
    display: flex;
    justify-content: space-around;
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
        font-size: clamp(14px, calc(1vw + 2px), 18px);
        letter-spacing: 0.5px;
        background: transparent;
        border: none;

        a {
            color: ${colors.dark_teal_heading};
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
    width: 30px;
    height: 30px;
    background: ${colors.light_blue_bg};
    display:flex;
    justify-content: center;
    align-items:center;
    cursor: pointer;
    border: none;

    img {
      width:10px;
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

/**
 * Styles for the search bar.
 */
const SearchBarStyles = {
  control: (provided) => ({
    ...provided,
    background: 'rgb(233, 245, 255, 0.8)',
    borderRadius: '35px',
    height: '5.5vh',
    fontFamily: '\'Rubik\', sans-serif',
    fontSize: 'calc(0.8vw + 0.6em)',
    color: colors.dark_teal_heading,
    padding: '0 1.5%',
    marginBottom: '20px',
    border: 'none',
    '&:hover': {
      cursor: 'text',
    },
    '&:focus': {
      outline: '0',
      border: 'none',
      boxShadow: 'none',
    },
  }),
  input: (provided) => ({
    ...provided,
    padding: '0',
    color: colors.dark_gray_text,
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: `${colors.dark_gray_text}`,
    cursor: 'pointer',
    '&:hover': {
      color: `${colors.dark_gray_text}`,
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: `${colors.dark_gray_text}`,
    display: 'none',
    '&:hover': {
      color: `${colors.dark_gray_text}`,
      cursor: 'pointer',
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    background: `${colors.dark_gray_text}`,
    display: 'none',
    '&:hover': {
      background: `${colors.dark_gray_text}`,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: `${colors.dark_gray_text}`,
  }),
  multiValue: (provided) => ({
    ...provided,
    color: `${colors.dark_gray_text}`,
    background: '#fff',
    marginRight: '10px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: `${colors.dark_gray_text}`,
  }),
  option: (provided) => ({
    ...provided,
    textAlign: 'left',
    fontWeight: '400',
    background: 'white',
    color: colors.dark_gray_text,
    cursor: 'pointer',
    padding: '10px',
    margin: '0',
    fontSize: '1em',
    '&:hover': {
      background: colors.light_blue_bg,
    },
  }),
};

export {
  StyledSearchHeader,
  StyledSearchButton,
  StyledNavBar,
  StyledLinkDropdowns,
  SearchBarStyles,
};
