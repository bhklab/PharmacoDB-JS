import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Description from './Description';
import Layout from '../Utils/Layout';
import Stats from './Stats';
import 'react-scroll-to-top/lib/index.css';

const StyledHome = styled.div`
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
const Home = () => (
  <Layout page="home">
    <ScrollToTop smooth />
    <StyledHome>
      <Description />
      <Stats />
    </StyledHome>
  </Layout>
);

export default Home;
