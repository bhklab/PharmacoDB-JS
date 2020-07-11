import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
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

  return (
    <StyledNavBar page={page}>
      <div className="container">
        <Link to="/"><img alt="logo" className="logo" src={page === 'home' ? logoDark : logoLight} /></Link>
        <StyledLinkDropdowns page={page}>
          <Dropdown className="link-dropdown" text="About" simple>
            <Dropdown.Menu className="link-menu">
              <Dropdown.Item><Link to="/about">About Us</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/documentation">Documentation</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/cite">Cite Us</Link></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="link-dropdown" text="Tools" simple>
            <Dropdown.Menu className="link-menu">
              <Dropdown.Item><Link to="/explore">Explore</Link></Dropdown.Item>
              <Dropdown.Item><Link to="/batch">Batch Query</Link></Dropdown.Item>
              <Dropdown.Item><a href="http://github.com/bhklab/pharmacodb">Github</a></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="link-dropdown" text="Datatypes" simple>
            <Dropdown.Menu className="link-menu">
              <Dropdown.Item>
                <span className="description">7</span>
                <Link to="/datasets">Datasets</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <span className="description">1,691</span>
                <Link to="/cell_lines">Cell lines</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <span className="description">41</span>
                <Link to="/tissues">Tissues</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <span className="description">759</span>
                <Link to="/compounds">Compounds</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <span className="description">19,933</span>
                <Link to="/genes">Genes</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <span className="description">650,894</span>
                <Link to="/experiments">Experiments</Link>
              </Dropdown.Item>
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
    </StyledNavBar>
  );
};

export default NavBar;
