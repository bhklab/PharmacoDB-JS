import React, { useState } from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../UtilComponents/Layout';
import DocDescription from './DocDescription';
import 'react-scroll-to-top/lib/index.css';
import colors from '../../../styles/colors';
import StyledWrapper from '../../../styles/utils';

/**
 * Parent component for the Documentation page,
 * includes child components for the DocDescription.
 *
 * @component
 * @example
 *
 * return (
 *   <Documentation/>
 * )
 */
const Documentation = () => (
    <Layout page="documentation">
        <StyledWrapper>
            <ScrollToTop smooth />
            <DocDescription/>
        </StyledWrapper>
    </Layout>
);

export default Documentation;
