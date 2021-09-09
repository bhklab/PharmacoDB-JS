import React from 'react';
import styled from 'styled-components';
import ScrollToTop from 'react-scroll-to-top';
import Layout from '../../../UtilComponents/Layout';
import PharmacoGxDescription from './PharmacoGxDescription';
import datasets from '../datasets'
import 'react-scroll-to-top/lib/index.css';

const StyledCiteUs = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/**
 * Parent component for the pharmacogx page,
 * includes child components for the description.
 *
 * @component
 * @example
 *
 * return (
 *   <PharmacoGx/>
 * )
 */
const PharmacoGx = (props) => {
    // parameter.
    const {
        match: { params },
    } = props;
    const dataset = datasets[params.id];
    return (
     <Layout page="PharmacoGx">
         <ScrollToTop smooth />
         <StyledCiteUs>
             <PharmacoGxDescription dataset={({ id: dataset.id, name: dataset.name })}/>
         </StyledCiteUs>
     </Layout>
    );
}

export default PharmacoGx;
