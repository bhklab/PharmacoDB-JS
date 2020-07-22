import React, { useState, useContext } from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';
import PageContext from '../../context/PageContext';

import logoDark from '../../images/pharmacodb-logo-dark.png';
import logoLight from '../../images/pharmacodb-logo.png';
import magnifImg from '../../images/magnif-glass.png';
import closeSearchImg from '../../images/close.png';
import { StyledLinkDropdowns, StyledNavBar, StyledSearchButton } from '../../styles/SearchHeaderStyles';

/**
 * Component for the navigation with links and logo.
 * Switches to contain a search bar on any page other than home.
 *
 * @component
 * @example
 *
 * const onClick = (e) => {};
 * return (
 *   <NavBar onClick={onClick}/>
 * )
 */
const NavBar = (props) => {
  const { onClick } = props;
  const page = useContext(PageContext);

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

  /**
   * Returns the dropdown items to be rendered.
   *
   * @param {Object} e  On click event
   * @returns {JSX} JSX to be rendered
   */

  const dropdownItems = (data) => data.map((x) => (
    <Dropdown.Item key={x.name}><Link to={x.url}>{x.name}</Link></Dropdown.Item>
  ));

  // for about menu dropdown
  const aboutLinks = [
    { url: '/about', name: 'About Us' },
    { url: '/documentation', name: 'Documentation' },
    { url: '/cite', name: 'Cite Us' },
  ];

  // for data menu dropdown
  const dataLinks = [
    { url: '/datasets', name: 'Datasets' },
    { url: '/cell_lines', name: 'Cell Lines' },
    { url: '/tissues', name: 'Tissues' },
    { url: '/compounds', name: 'Compounds' },
    { url: '/genes', name: 'Genes' },
    { url: '/experiments', name: 'Experiments' },
  ];

  return (
    <StyledNavBar className="header" page={page}>
      <BrowserRouter>
        <div className="container">
          <Link to="/"><img alt="logo" className="logo" src={page === 'home' ? logoDark : logoLight} /></Link>
          <StyledLinkDropdowns page={page}>
            <Dropdown className="header-links link-dropdown" text="About" simple>
              <Dropdown.Menu className="link-menu">
                {dropdownItems(aboutLinks)}
                <Dropdown.Item><a href="http://github.com/bhklab/pharmacodb">Github</a></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Link className="header-links link" to="/explore">Explore</Link>
            <Dropdown className="header-links link-dropdown" text="Data" simple>
              <Dropdown.Menu className="link-menu">
                {dropdownItems(dataLinks)}
              </Dropdown.Menu>
            </Dropdown>

            {page === 'home' ? null : (
              <StyledSearchButton className="search-button" onClick={handleClick}>
                {isOpen ? (
                  <img alt="close" src={closeSearchImg} />
                ) : (
                  <img alt="magnifying glass" src={magnifImg} />
                )}
              </StyledSearchButton>
            )}
          </StyledLinkDropdowns>
        </div>
      </BrowserRouter>
    </StyledNavBar>
  );
};

NavBar.propTypes = {
  /**
   * NavBar' onClick handler for search
  */
  onClick: PropTypes.func.isRequired,
};

export default NavBar;
