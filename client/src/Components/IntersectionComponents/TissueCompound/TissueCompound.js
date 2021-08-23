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
 * Formats experiments data into plot and table friendly format
 * @param {*} experiments 
 * @returns 
 */
 const parseData = (experiments) => {
    // Sort the experiments alphabetically by dataset name, then cell line name
    experiments.sort((a, b) => (
        a.dataset.name.localeCompare(b.dataset.name) !== 0 ? 
        a.dataset.name.localeCompare(b.dataset.name) 
        :
        a.cell_line.name.localeCompare(b.cell_line.name) 
    ));

    // Parse cell lines and datasets data to control plot interactions
    let datasets = experiments.map(item => item.dataset.name);
    datasets = [...new Set(datasets)].map(item => ({
        name: item,
        checked: true,
    }));
    datasets.sort((a, b) => a.name.localeCompare(b.name));
    
    let cellLineColors = [];
    for(let i = 0; i < 4; i++){
        let col = plotColors.gradients.map(item => item[i]);
        cellLineColors = cellLineColors.concat(col);
    }
    let cellLines = experiments.map(item => item.cell_line.name);
    cellLines.sort((a, b) => a.localeCompare(b));
    cellLines = [...new Set(cellLines)].map((item, i) => ({
        name: item,
        checked: false,
        disabled: false,
        color: i < cellLineColors.length ? cellLineColors[i] : plotColors.default[1]
    }));

    // Add other fields that will be used in the plot and the table.
    let parsed = experiments.map((item, i) => ({
        ...item, 
        id: i, // add id to each experiment so that it is easy to identify in the table and the plot.
        name: `${item.cell_line.name} - ${item.dataset.name}`,
        color: plotColors.default[1],
        visible: true,
        displayCurve: typeof item.profile.AAC === 'number',
        curveWidth: 0.5,
        highlight: cellLines.find(cell => cell.name === item.cell_line.name).color,
        visibleStats: {
            AAC: { visible: false, clicked: false },
            IC50: { visible: false, clicked: false },
            EC50: { visible: false, clicked: false },
            Einf: { visible: false, clicked: false },
            DSS1: { visible: false, clicked: false },
        }
    }));

    // Parse experiment data into CSV-friendly format.
    let csv = [];
    for(const experiment of experiments){
        experiment.dose_response.forEach(item => {
            csv.push({
                tissue: experiment.tissue.name,
                compound: experiment.compound.name,
                cell_line: experiment.cell_line.name,
                dataset: experiment.dataset.name,
                dose: item.dose,
                response: item.response
            });
        });
    }
    
    return({
        experiments: parsed,
        datasets: datasets,
        cellLines: cellLines,
        csv: csv
    });
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
    const [datasets, setDatasets] = useState([]);
    const [cellLines, setCellLines] = useState([]);
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
            let parsed = parseData(data.experiments)
            setExperiments(parsed.experiments);
            setCSVData(parsed.csv);
            setDatasets(parsed.datasets);
            setCellLines(parsed.cellLines);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    const getLink = (name, data) => (
        <a href={`/${name}/${data.id}`}>{data.name}</a>
    );

    const handleDatasettSelectionChange = (e) => {
        let copy = JSON.parse(JSON.stringify(experiments));
        copy.forEach(item => {
            if(item.dataset.name === e.target.value){
                item.visible = e.target.checked;
                if(!e.target.checked){
                    item.visibleStats.AAC = { visible: false, clicked: false };
                    item.visibleStats.IC50 = { visible: false, clicked: false };
                    item.visibleStats.EC50 = { visible: false, clicked: false };
                    item.visibleStats.Einf = { visible: false, clicked: false };
                }
            }
        });
        
        // Enable/disable cell line selector options depending on the dataset selection.
        let filtered = copy.filter(item => item.visible).map(item => item.cell_line.name);
        filtered = [...new Set(filtered)];
        let cellOptions = cellLines.map(item => ({
            ...item,
            disabled: !filtered.includes(item.name)
        }));
        setCellLines(cellOptions);
        setExperiments(copy);
    };

    const handleCellLineSelectionChange = (e) => {
        let copy = [...experiments];
        copy.forEach(item => {
            if(item.cell_line.name === e.target.value){
                item.curveWidth = e.target.checked ? 2 : 0.5;
                item.color = e.target.checked ? item.highlight : plotColors.default[1];
            }
        });
        setExperiments(copy);
    };

    const onCurveHover = (e) => {
        // console.log(e.points[0].data.id);
        // let copy = JSON.parse(JSON.stringify(experiments));
        // let index = copy.findIndex(item => item.id === e.points[0].data.id);
        // copy[index].curveWidth = 3;
        // copy[index].color = copy[index].highlight
        // setExperiments(copy);
    };

    const onCurveUnhover = (e) => {
        // console.log(e.points[0].data.id);
        // let copy = JSON.parse(JSON.stringify(experiments));
        // let index = copy.findIndex(item => item.id === e.points[0].data.id);
        // copy[index].curveWidth = 1;
        // copy[index].color = plotColors.default[1];
        // setExperiments(copy);
    }

    const onCurveClick = (e) => {
        console.log(e.points[0].data.id);
        let copy = [...experiments];
        let found = copy.find(item => item.id === e.points[0].data.id);
        copy.forEach(item => {
            if(item.cell_line.name === found.cell_line.name){
                item.curveWidth = item.curveWidth === 0.5 ? 2 : 0.5;
                item.color = item.color === plotColors.default[1] ? item.highlight : plotColors.default[1];
            }
        });
        setExperiments(copy);
    }

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
                                <StyledDoseResponseContainer>
                                    <div className='plot'>
                                        <DoseResponseCurve 
                                            plotId='tissue_compound_dose_response'
                                            experiments={experiments}
                                            showScatter={false}
                                            onHover={onCurveHover}
                                            onUnhover={onCurveUnhover}
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
                                                data={csvData}
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
                                                        color={plotColors.default[0]}
                                                        onChange={handleDatasettSelectionChange}
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