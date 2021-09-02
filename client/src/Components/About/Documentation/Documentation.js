import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import 'react-scroll-to-top/lib/index.css';

const StyledDocumentation = styled.div`
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
const Documentation = () => (
    <Layout page="documentation">
        <ScrollToTop smooth />
        <StyledDocumentation>
            <p>Documentation Content!</p>
        </StyledDocumentation>
    </Layout>
);

export default Documentation;
