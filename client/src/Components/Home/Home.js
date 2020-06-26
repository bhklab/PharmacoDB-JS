import React from 'react';
import Description from './Description';
import Layout from '../Layout/Layout';
import Stats from './Stats';

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
            <Description/>
            <Stats/>
        </Layout>
    );
};

export default Home;