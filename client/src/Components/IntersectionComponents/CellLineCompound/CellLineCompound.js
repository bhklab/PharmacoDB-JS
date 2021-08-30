/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLineCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import useExpIntersection from '../../../utils/useExpIntersection';
import PageContext from '../../../context/PageContext';
import Checkbox from '../../UtilComponents/Checkbox';
import DownloadButton from '../../UtilComponents/DownloadButton';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import CellLineCompoundTable from './CellLineCompoundTable';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';
import styled from 'styled-components';

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
        max-height: 450px;
        overflow-y: auto;
    }
`;

/**
 * Component to render cell line vs compound page.
 * @param {*} props requires cell_line and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns CellLineCompound component
 */
const CellLineCompound = (props) => {
    const { cell_line, compound } = props;
    const [error, setError] = useState(false);

    const {
        experiments,
        plotData,
        plotCSVData,
        tableData,
        parseExperiments,
        showHideCurve,
        showStat,
        hideStat,
        alterClickedCells,
        isClicked,
        isDisabled,
        getLink
    } = useExpIntersection();

    // query to get the data for the single gene.
    const { loading } = useQuery(getCellLineCompoundExperimentsQuery, {
        variables: { 
            cellLineId: typeof Number(cell_line) === 'number' ? Number(cell_line) : undefined,
            cellLineName: typeof cell_line === 'string' ? cell_line : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => { 
            parseExperiments(data.experiments, true);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    return(
        <Layout>
            <StyledWrapper>
                {
                    loading ? <Loading />
                    :
                    error ? <Error />
                    :
                    typeof experiments !== 'undefined' &&
                    <PageContext.Provider value={{showStat, hideStat, alterClickedCells, isClicked, isDisabled}}>
                        {
                            experiments.length > 0 ?
                            <StyledIntersectionComponent>
                                <h2>
                                    {getLink('cell_line')} treated with {getLink('compound')}
                                </h2>
                                <StyledDoseResponseContainer>
                                    <div className='plot'>
                                        <DoseResponseCurve 
                                            plotId='cell_compound_dose_response'
                                            showScatter={true}
                                            plotData={plotData}
                                            traces={plotData.traces}
                                        />
                                        <div className='download-buttons'>
                                            <DownloadButton 
                                                className='left'
                                                label='SVG' 
                                                mode='svg' 
                                                filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}`}
                                                plotId='cell_compound_dose_response'
                                            />
                                            <DownloadButton 
                                                className='left'
                                                label='PNG' 
                                                mode='png' 
                                                filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}`}
                                                plotId='cell_compound_dose_response'
                                            />
                                            <DownloadButton 
                                                label='CSV' 
                                                mode='csv' 
                                                filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}-dose_response`}
                                                data={plotCSVData}
                                            />
                                        </div>
                                    </div>
                                    <div className='right-panel'>
                                        {
                                            experiments.map((item, i) => (
                                                <Checkbox 
                                                    key={i}
                                                    value={item.experiment.name}
                                                    label={item.experiment.name}
                                                    checked={item.visible}
                                                    color={item.color}
                                                    onChange={(e) => {showHideCurve(e, 'experiment')}}
                                                    disabled={!item.displayCurve}
                                                />
                                            ))
                                        }
                                    </div>
                                </StyledDoseResponseContainer>
                                <CellLineCompoundTable data={tableData} />
                            </StyledIntersectionComponent>
                            :
                            <h3>No experiments were found with the given combination of cell line and compound.</h3>
                        }
                    </PageContext.Provider>
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
