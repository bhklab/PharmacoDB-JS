/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getTissueCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import useExpIntersection from '../../../utils/useExpIntersection';
import PageContext from '../../../context/PageContext';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import TissueCompoundTable from './TissueCompoundTable';
import Checkbox from '../../UtilComponents/Checkbox';
import DownloadButton from '../../UtilComponents/DownloadButton';

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
        .checkbox-group {
            margin-bottom: 20px;
            .title {
                font-size: 15px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .dataset-selector {
                max-height: 250px;
                overflow-y: auto;
            }
            .cell-line-selector {
                max-height: 250px;
                overflow-y: auto;
            }
        }
    }
`;

/**
 * Component to render tissue vs compound page.
 * @param {*} props requires tissue and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns TissueCompound component
 */
const TissueDrug = (props) => {
    const { tissue, compound } = props;
    const [error, setError] = useState(false);

    const {
        experiments,
        datasets,
        cellLines,
        plotData,
        plotCSVData,
        tableData,
        parseExperiments,
        showHideCurve,
        handleCellLineSelectionChange,
        showStat,
        hideStat,
        onCurveClick,
        alterClickedCells,
        isClicked,
        isDisabled,
        getLink
    } = useExpIntersection();

    // query to get the data for the single gene.
    const { loading } = useQuery(getTissueCompoundExperimentsQuery, {
        variables: {
            tissueId: typeof Number(tissue) === 'number' ? Number(tissue) : undefined,
            tissueName: typeof tissue === 'string' ? tissue : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => {
            parseExperiments(data.experiments, false, true);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    return (
        <Layout>
            <StyledWrapper>
                {
                    loading ? <Loading />
                        :
                        error ? <Error />
                            :
                            typeof experiments !== 'undefined' &&
                            <PageContext.Provider value={{ showStat, hideStat, alterClickedCells, isClicked, isDisabled }}>
                                {
                                    experiments.length > 0 ?
                                        <StyledIntersectionComponent>
                                            <h2>
                                                {getLink('tissue')} treated with {getLink('compound')}
                                            </h2>
                                            <StyledDoseResponseContainer>
                                                <div className='plot'>
                                                    <DoseResponseCurve
                                                        plotId='tissue_compound_dose_response'
                                                        plotData={plotData}
                                                        traces={plotData.traces}
                                                        showScatter={false}
                                                        onClick={onCurveClick}
                                                    />
                                                    <div className='download-buttons'>
                                                        <DownloadButton
                                                            className='left'
                                                            label='SVG'
                                                            mode='svg'
                                                            filename={`${experiments[0].compound.name}-${experiments[0].tissue.name}`}
                                                            plotId='tissue_compound_dose_response'
                                                        />
                                                        <DownloadButton
                                                            className='left'
                                                            label='PNG'
                                                            mode='png'
                                                            filename={`${experiments[0].compound.name}-${experiments[0].tissue.name}`}
                                                            plotId='tissue_compound_dose_response'
                                                        />
                                                        <DownloadButton
                                                            label='CSV'
                                                            mode='csv'
                                                            filename={`${experiments[0].compound.name}-${experiments[0].tissue.name}-dose_response`}
                                                            data={plotCSVData}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='right-panel'>
                                                    <div className='checkbox-group'>
                                                        <div className='title'>Dataset Selector</div>
                                                        <div className='dataset-selector'>
                                                            {
                                                                datasets.map((item, i) => (
                                                                    <Checkbox
                                                                        key={i}
                                                                        value={item.name}
                                                                        label={item.name}
                                                                        checked={item.checked}
                                                                        color={item.color}
                                                                        onChange={(e) => { showHideCurve(e, 'dataset') }}
                                                                    />
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='checkbox-group'>
                                                        <div className='title'>Cell Line Selector</div>
                                                        <div className='cell-line-selector'>
                                                            {
                                                                cellLines.map((item, i) => (
                                                                    <Checkbox
                                                                        key={i}
                                                                        value={item.name}
                                                                        label={item.name}
                                                                        checked={item.checked}
                                                                        color={item.color}
                                                                        onChange={handleCellLineSelectionChange}
                                                                        disabled={item.disabled}
                                                                    />
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </StyledDoseResponseContainer>
                                            <TissueCompoundTable data={tableData} />
                                        </StyledIntersectionComponent>
                                        :
                                        <h3>No experiments were found with the given combination of tissue and compound.</h3>
                                }
                            </PageContext.Provider>
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