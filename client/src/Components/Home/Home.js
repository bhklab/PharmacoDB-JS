import React from 'react';
import Description from './Description';
import Layout from '../Layout/Layout';
import Stats from './Stats';
import styled from 'styled-components';

const StyledHome = styled.div`
    display:flex;
    flex-direction: column;
    align-items:center;
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
const Home = () => {
    return (
        <Layout page="home">
            <StyledHome>
                <Description/>
                <Stats/>
            </StyledHome>
        </Layout>
    );
};

export default Home;