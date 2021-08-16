/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLineCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import Checkbox from '../../UtilComponents/Checkbox';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import CellLineCompoundTable from './CellLineCompoundTable';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';
import plotColors from '../../../styles/plot_colors';
import styled from 'styled-components';

const StyledDoseResponseContainer = styled.div`
    display: flex;
    .right-panel {
        margin-top: 50px;
    }
`;

/**
 * Component to render cell line vs component page.
 * @param {*} props requires cell_line and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns CellLineCompound component
 */
const CellLineCompound = (props) => {
    const { cell_line, compound } = props;
    const [error, setError] = useState(false);
    const [experiments, setExperiments] = useState(undefined);
    const [displayedStats, setDisplayedStats] = useState([]);

    // query to get the data for the single gene.
    const { loading } = useQuery(getCellLineCompoundExperimentsQuery, {
        variables: { 
            cellLineId: typeof Number(cell_line) === 'number' ? Number(cell_line) : undefined,
            cellLineName: typeof cell_line === 'string' ? cell_line : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => {
            setExperiments(data.experiments.map((item, i) => ({
                ...item, 
                id: i,
                name: item.dataset.name,
                visible: true,
                color: plotColors[i],
                visibleStats: {
                    AAC: { visible: false, clicked: false },
                    IC50: { visible: false, clicked: false },
                    EC50: { visible: false, clicked: false },
                    Einf: { visible: false, clicked: false },
                    DSS1: { visible: false, clicked: false },
                }
            }))); // add id to each experiment so that it is easy to identify in the table and the plot.
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    const getLink = (name, data) => (
        <a href={`/${name}/${data.id}`}>{data.name}</a>
    );

    const handleExperimentSelectionChange = (e) => {
        let copy = JSON.parse(JSON.stringify(experiments));
        copy.forEach(item => {
            if(item.name === e.target.value){
                item.visible = e.target.checked;
                if(!e.target.checked){
                    item.visibleStats.AAC = { visible: false, clicked: false };
                    item.visibleStats.IC50 = { visible: false, clicked: false };
                    item.visibleStats.EC50 = { visible: false, clicked: false };
                    item.visibleStats.Einf = { visible: false, clicked: false };
                    item.visibleStats.DSS1 = { visible: false, clicked: false };
                }
            }
        });
        setExperiments(copy);
    };

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
                                <h2>{getLink('cell_lines', experiments[0].cell_line)} treated with {getLink('compounds', experiments[0].compound)}</h2>
                                <StyledDoseResponseContainer>
                                    <DoseResponseCurve 
                                        experiments={experiments}
                                        displayedStats={displayedStats} 
                                    />
                                    <div className='right-panel'>
                                        {
                                            experiments.map((item, i) => (
                                                <Checkbox 
                                                    key={i}
                                                    value={item.name}
                                                    label={item.name}
                                                    checked={item.visible}
                                                    color={item.color}
                                                    onChange={handleExperimentSelectionChange}
                                                />
                                            ))
                                        }
                                    </div>
                                </StyledDoseResponseContainer>
                                <CellLineCompoundTable 
                                    experiments={experiments} 
                                    setExperiments={setExperiments}
                                />
                            </StyledIntersectionComponent>
                            :
                            <h3>No experiments were found with a given combination of cell line and compound.</h3>
                        }
                    </React.Fragment>
                }
            </StyledWrapper>
        </Layout>
    );
}

CellLineCompound.propTypes = {
    cell_line: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    compound: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default CellLineCompound;
