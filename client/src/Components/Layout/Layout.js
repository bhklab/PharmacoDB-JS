import React from 'react';
import PropTypes from 'prop-types';
import SearchHeader from '../SearchHeader/SearchHeader';

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
  return (
    <>
      <SearchHeader page={page} />
      <main>{children}</main>
    </>
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
