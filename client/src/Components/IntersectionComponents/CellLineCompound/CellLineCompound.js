/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLineCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import Checkbox from '../../UtilComponents/Checkbox';
import DownloadButton from '../../UtilComponents/DownloadButton';
import DoseResponseCurve from '../../Plots/DoseResponseCurve';
import CellLineCompoundTable from './CellLineCompoundTable';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';
import plotColors from '../../../styles/plot_colors';
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
    }
`;

/**
 * Formats experiments data into plot and table friendly format
 * @param {*} experiments 
 * @returns 
 */
const parseExperiments = (experiments) => {
    let parsed = [];
    
    // assign color and name to each experiment
    let colorIndex = 0;
    let uniqueDatasets = experiments.map(item => item.dataset.name);
    uniqueDatasets = [...new Set(uniqueDatasets)];
    for(const dataset of uniqueDatasets){
        // Process each experiment by dataset.
        let filtered = experiments.filter(item => item.dataset.name === dataset);
        
        // If multiple experiments (repeated) are present, assign them with number and similar colors.
        // If we ran out of colors, it'll default to the default color.
        if(filtered.length > 1){
            let repeats = filtered.map((item, i) => ({
                ...item,
                name: `${item.dataset.name} rep ${i + 1}`,
                color: plotColors.gradients[colorIndex] ? plotColors.gradients[colorIndex][i <= 3 ? i : 3] : plotColors.default[3]
            }));
            parsed = parsed.concat(repeats);
            colorIndex++;
        }else{
            parsed.push({
                ...filtered[0],
                name: filtered[0].dataset.name,
                color: plotColors.gradients[colorIndex] ? plotColors.gradients[colorIndex][0] : plotColors.default[3]
            });
            colorIndex++
        }
    }

    // Add other fields that will be used in the plot and the table.
    return parsed.map((item, i) => ({
        ...item, 
        id: i, // add id to each experiment so that it is easy to identify in the table and the plot.
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
 * Formats plot experiment data for CSV file download
 * @param {*} experiments 
 * @returns 
 */
const parseCSVData = (experiments) => {
    console.log(experiments)
    let csv = [];
    for(const experiment of experiments){
        experiment.dose_response.forEach(item => {
            csv.push({
                cell_line: experiment.cell_line.name,
                compound: experiment.compound.name,
                dataset: experiment.dataset.name,
                dose: item.dose,
                response: item.response
            });
        })
        
    }
    return csv;
}

/**
 * Component to render cell line vs compound page.
 * @param {*} props requires cell_line and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns CellLineCompound component
 */
const CellLineCompound = (props) => {
    const { cell_line, compound } = props;
    const [error, setError] = useState(false);
    const [experiments, setExperiments] = useState(undefined);
    const [csvData, setCSVData] = useState([]);

    // query to get the data for the single gene.
    const { loading } = useQuery(getCellLineCompoundExperimentsQuery, {
        variables: { 
            cellLineId: typeof Number(cell_line) === 'number' ? Number(cell_line) : undefined,
            cellLineName: typeof cell_line === 'string' ? cell_line : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => { 
            setExperiments(parseExperiments(data.experiments));
            setCSVData(parseCSVData(data.experiments));
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
                                <h2>
                                    {getLink('cell_lines', experiments[0].cell_line)} treated with {getLink('compounds', experiments[0].compound)}
                                </h2>
                                <StyledDoseResponseContainer>
                                    <div className='plot'>
                                        <DoseResponseCurve 
                                            plotId='cell_compound_dose_response'
                                            experiments={experiments}
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
                                                filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}`}
                                                data={csvData}
                                            />
                                        </div>
                                    </div>
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
                                                    disabled={!item.displayCurve}
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
                            <h3>No experiments were found with the given combination of cell line and compound.</h3>
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
