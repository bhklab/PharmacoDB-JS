/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import PropTypes from 'prop-types';

const TissueDrug = (props) => {
    const { tissue, drug } = props;

    return(
        <Layout>
            <StyledWrapper>
                tissue vs drug
            </StyledWrapper>
        </Layout>
    );
}

TissueDrug.propTypes = {
    tissue: PropTypes.string.isRequired,
    drug: PropTypes.string.isRequired
}

export default TissueDrug;