import { slide as Menu } from 'react-burger-menu';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import colors from '../../styles/colors';
import PageContext from '../../context/PageContext';

const BurgerMenu = () => {
  const page = useContext(PageContext);
  const styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      right: '36px',
      top: '40px',
      background: page === 'home' ? colors.dark_teal_heading : 'white',
    },
    bmBurgerBars: {
      background: page === 'home' ? 'white' : colors.dark_teal_heading,
      opacity: 0.8,
    },
    bmBurgerBarsHover: {
    },
    bmCrossButton: {
      height: '24px',
      width: '24px',
    },
    bmCross: {
      background: '#bdc3c7',
    },
    bmMenuWrap: {
      position: 'fixed',
    },
    bmMenu: {
      background: colors.dark_gray_text,
      padding: '2.5em 1.5em 0',
      fontSize: '1.15em',
      color: 'white',
    },
    bmItemList: {
      padding: '0.8em',
      display: 'flex',
      flexDirection: 'column',
      height: 'auto',
    },
    bmItem: {
      color: 'white',
      display: 'inline-block',
      fontFamily: "'Rubik', sans-serif",
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)',
    },
  };

  /**
   * Returns the dropdown items to be rendered.
   *
   * @param {Object} e  On click event
   * @returns {JSX} JSX to be rendered
   */

  const dropdownItems = (data) => data.map((x) => (
    <Link className="burger-item" to={x.url}>{x.name}</Link>
  ));

  // for about menu dropdown
  const aboutLinks = [
    { url: '/about', name: 'About Us' },
    { url: '/explore', name: 'Explore' },
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
    <Menu className="burger-menu" styles={styles} noOverlay right disableAutoFocus isOpen={false}>
      <h2>About</h2>
      {dropdownItems(aboutLinks)}
      <p />
      <h2>Data</h2>
      {dropdownItems(dataLinks)}
    </Menu>
  );
};

export default BurgerMenu;
