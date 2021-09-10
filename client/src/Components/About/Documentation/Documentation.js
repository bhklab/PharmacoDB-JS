import React, { useState } from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import DocDescription from './DocDescription';
import 'react-scroll-to-top/lib/index.css';
import colors from '../../../styles/colors';

const StyledDocumentation = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  
    width: 75%;
    margin-top: 8vh;

    .text-container {
        width: 100%;

        display: flex;
        flex-direction: column;

        span {
            font-size: calc(0.5vw + 0.7em);
            line-height: calc(1vw + 1em);
            margin: 4vh;
        }

        h1 {
            color: ${colors.dark_teal_heading};
            font-family: 'Roboto Slab', serif;
            font-size: calc(1.8vw + 1em) !important;
            margin-bottom: 4vh;
            align-self: center;
        }
    }

    .code-container {
      display: flex;
      flex-direction: column;
      width: 75%;
      margin: auto;
      max-width: 800px;
      border: 1px solid gray;
      padding: 10px;
      background-color:#EEEEEE;
      font-family:Consolas,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
    }

    /* mobile */
    @media only screen and (max-width: 1081px) {
        .text-container{
          width:100%;
        }
    } 
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
            <DocDescription/>
        </StyledDocumentation>
    </Layout>
);

export default Documentation;
