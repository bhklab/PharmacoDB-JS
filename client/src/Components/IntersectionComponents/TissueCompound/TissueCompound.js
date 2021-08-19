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
import TissueCompoundTable from './TissueCompoundTable';

const StyledDoseResponseContainer = styled.div`
    display: flex;
    .plot {
        width: 100%;
        .download-buttons {
            margin-right: 50px;
            display: flex;
            justify-content: flex-end;
            .left {
                margin-right: 5px;
            } 
        }
    }
    .right-panel {
        min-width: 150px;
        margin-top: 50px;
    }
`;

/**
 * Formats experiments data into plot and table friendly format
 * @param {*} experiments 
 * @returns 
 */
 const parseExperiments = (experiments) => {

    experiments.sort((a, b) => (
        a.dataset.name.localeCompare(b.dataset.name) !== 0 ? 
        a.dataset.name.localeCompare(b.dataset.name) 
        :
        a.cell_line.name.localeCompare(b.cell_line.name) 
    ));

    // Add other fields that will be used in the plot and the table.
    return experiments.map((item, i) => ({
        ...item, 
        id: i, // add id to each experiment so that it is easy to identify in the table and the plot.
        name: `${item.cell_line.name} - ${item.dataset.name}`,
        visible: true,
        displayCurve: typeof item.profile.AAC === 'number',
        visibleStats: {
            AAC: { visible: false, clicked: false },
            IC50: { visible: false, clicked: false },
            EC50: { visible: false, clicked: false },
            Einf: { visible: false, clicked: false },
            DSS1: { visible: false, clicked: false },
        }
    }));
}

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
            console.log(data);
            setExperiments(parseExperiments(data.experiments));
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
                                <TissueCompoundTable 
                                    experiments={experiments}
                                    setExperiments={setExperiments}
                                />
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