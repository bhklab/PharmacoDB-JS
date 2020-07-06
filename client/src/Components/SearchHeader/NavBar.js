import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import logoDark from '../../images/pharmacodb-logo-dark.png';
import logoLight from '../../images/pharmacodb-logo.png';
import magnifImg from '../../images/magnif-glass.png';
import closeSearchImg from '../../images/close.png';
import colors from '../../styles/colors';

const StyledNavBar = styled.div`
    position: static;
    width: 100%;
    padding-top: 40px;
    height: ${(props) => (props.page === 'home' ? 'auto' : '100px')};
    
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

const StyledLinks = styled.div`
    width: ${(props) => (props.page === 'home' ? '30%' : '40%')};
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
        color: ${(props) => (props.page === 'home' ? colors.light_blue_header : colors.dark_teal_heading)};
        font-family: 'Rubik', sans-serif;
        font-weight: 400;
        font-size: calc(0.4vw + 0.9em);
        letter-spacing: 0.5px;
    }
`;

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

/**
 * Component for the navigation with links and logo.
 * Switches to contain a search bar on any page other than home.
 *
 * @component
 * @example
 *
 * const page = "home"
 * const onClick = (e) => {};
 * return (
 *   <NavBar page={page} onClick={onClick}/>
 * )
 */
const NavBar = (props) => {
  const { page, onClick } = props;
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles click of search button. Sends props to parent
   * component for dropping search bar down.
   *
   * @param {Object} e  On click event
   */
  const handleClick = (e) => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
    onClick(isOpen);
  };

  return (
    <StyledNavBar page={page}>
      <div className="container">
        <Link to="/"><img alt="logo" className="logo" src={page === 'home' ? logoDark : logoLight} /></Link>
        <StyledLinks page={page}>
          <Link to="/">About</Link>
          <Link to="/">Tools</Link>
          <Link to="/compounds">Datatypes</Link>
          {page === 'home' ? null : (
            <StyledSearchButton className="search-button" onClick={handleClick}>
              {isOpen ? (
                <img alt="close" src={closeSearchImg} />
              ) : (
                <img alt="magnifying glass" src={magnifImg} />
              )}
            </StyledSearchButton>
          )}
        </StyledLinks>

      </div>
    </StyledNavBar>
  );
};

NavBar.propTypes = {
  /**
   * NavBar's page name
  */
  page: PropTypes.string,
};

NavBar.defaultProps = {
  page: '',
};

export default NavBar;
