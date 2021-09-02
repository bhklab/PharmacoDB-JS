import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import 'react-scroll-to-top/lib/index.css';

const StyledCiteUs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/**
 * Parent component for the home page,
 * includes child components for the description and stats.
 *
 * @component
 * @example
 *
 * return (
 *   <Home/>
 * )
 */
const CiteUs = () => (
    <Layout page="about">
        <ScrollToTop smooth />
        <StyledCiteUs>
            <p>Cite Us Content!</p>
        </StyledCiteUs>
    </Layout>
);

export default CiteUs;
