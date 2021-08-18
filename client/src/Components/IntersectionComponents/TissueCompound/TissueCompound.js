/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getTissueCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';
import plotColors from '../../../styles/plot_colors';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Component to render tissue vs compound page.
 * @param {*} props requires tissue and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns TissueCompound component
 */
const TissueDrug = (props) => {
    const { tissue, compound } = props;
    const [error, setError] = useState(false);
    const [experiments, setExperiments] = useState(undefined);
    const [csvData, setCSVData] = useState([]);

    // query to get the data for the single gene.
    const { loading } = useQuery(getTissueCompoundExperimentsQuery, {
        variables: { 
            tissueId: typeof Number(tissue) === 'number' ? Number(tissue) : undefined,
            tissueName: typeof tissue === 'string' ? tissue : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => { 
            setExperiments(data.experiments);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    const getLink = (name, data) => (
        <a href={`/${name}/${data.id}`}>{data.name}</a>
    );

    return(
        <Layout>
            <StyledWrapper>
                {
                    loading ? <Loading />
                    :
                    error ? <Error />
                    :
                    typeof experiments !== 'undefined' &&
                    <React.Fragment>
                        {
                            experiments.length > 0 ?
                            <StyledIntersectionComponent>
                                <h2>
                                    {getLink('tissue', experiments[0].tissue)} treated with {getLink('compounds', experiments[0].compound)}
                                </h2>

                            </StyledIntersectionComponent>
                            :
                            <h3>No experiments were found with the given combination of tissue and compound.</h3>
                        }
                    </React.Fragment>
                }
            </StyledWrapper>
        </Layout>
    );
}

TissueDrug.propTypes = {
    tissue: PropTypes.string.isRequired,
    compound: PropTypes.string.isRequired
}

export default TissueDrug;