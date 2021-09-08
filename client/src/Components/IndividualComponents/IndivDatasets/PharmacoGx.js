import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import 'react-scroll-to-top/lib/index.css';

const StyledPharmacoGx = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/**
 * Parent component for the PharmacoGx page,
 * includes child components for the dataset descriptions.
 *
 * @component
 * @example
 *
 * return (
 *   <PharmacoGx/>
 * )
 */
const PharmacoGx = () => (
    <Layout page="PharmacoGx">
        <ScrollToTop smooth />
        <StyledPharmacoGx>
            <p>Hello</p>
        </StyledPharmacoGx>
    </Layout>
);

export default PharmacoGx;
