import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import CiteUsDescription from './CiteUsDescription';
import 'react-scroll-to-top/lib/index.css';

const StyledCiteUs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/**
 * Parent component for the cite us page,
 * includes child components for the description.
 *
 * @component
 * @example
 *
 * return (
 *   <CiteUs/>
 * )
 */
const CiteUs = () => (
    <Layout page="Cite Us">
        <ScrollToTop smooth />
        <StyledCiteUs>
            <CiteUsDescription />
        </StyledCiteUs>
    </Layout>
);

export default CiteUs;
