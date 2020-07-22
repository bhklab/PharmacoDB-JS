import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';

import StyledWrapper from '../../styles/utils';

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
