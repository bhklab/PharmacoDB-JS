import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import AboutUsDescription from './AboutUsDescription';
import 'react-scroll-to-top/lib/index.css';

const StyledAboutUs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 200px;
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
const AboutUs = () => (
    <Layout page="about">
        <ScrollToTop smooth />
        <StyledAboutUs>
            <AboutUsDescription />
        </StyledAboutUs>
    </Layout>
);

export default AboutUs;
