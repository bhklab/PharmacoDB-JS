import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import SearchHeader from '../Search/SearchHeader';
import PageContext from '../../context/PageContext';
import SearchContext from '../../context/SearchContext';
import BurgerMenu from '../Search/BurgerMenu';

/**
 * Capitalize first letter
 */
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Wrapper for every page - includes the SearchHeader,
 * which needs to be passed the page prop to be full-sized
 * or minimized.
 *
 * @component
 * @example
 *
 * const page = "home"
 * return (
 *   <SearchHeader page={page}/>
 * )
 */
const Layout = (props) => {
  const { children, page } = props;
  const { blur } = useContext(SearchContext);
  return (
    <PageContext.Provider value={page}>
      <Helmet>
        <title>{`${capitalize(page)} | PharmacoDB`}</title>
      </Helmet>
      <BurgerMenu />
      <SearchHeader />
      <main className={blur ? 'blur' : null}>
        {children}
      </main>
    </PageContext.Provider>
  );
};

Layout.propTypes = {
  /**
     * Layout's page name
     */
  page: PropTypes.string,
  /**
     * Layout's children (components on the page)
     */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Layout.defaultProps = {
  page: '',
  children: null,
};

export default Layout;
