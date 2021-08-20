import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import StyledWrapper from '../../styles/utils';

/**
 * Returns JSX for the not found page. Meant to be reused.
 *
 * @returns {JSX} the content of the not found page.
 */
export const NotFoundContent = () => (
  <>
    <h1>Page Not Found.</h1>
    <p style={{ textAlign: 'center', marginTop: '5vh', fontSize: 'calc(0.6vw + 0.9em)' }}>
      <Link to="/">← Go Home</Link>
    </p>
  </>
);

/**
 * Component for the Page Not Found error page.
 *
 * @component
 * @example
 *
 * return (
 *   <NotFoundPage/>
 * )
 */
const NotFoundPage = () => (
  <Layout>
    <StyledWrapper>
      <h1>Page Not Found.</h1>
      <p style={{ textAlign: 'center', marginTop: '5vh', fontSize: 'calc(0.6vw + 0.9em)' }}>
        <Link to="/">← Go Home</Link>
      </p>
    </StyledWrapper>
  </Layout>
);

export default NotFoundPage;
