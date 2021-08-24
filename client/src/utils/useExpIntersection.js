import React, { useState } from 'react';
import plotColors from '../styles/plot_colors';
import { getDoseResponseCurveData } from './doseResponseCurveHelper';

/**
 * A hook used in cell line vs compound and tissue vs. compound pages.
 * Contains states and functions that are shared in both pages.
 * @returns 
 */
const useExpIntersection = () => {
    const [experiments, setExperiments] = useState(undefined);
    const [plotData, setPlotData] = useState({traces: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0});
    const [plotCSVData, setPlotCSVData] = useState([]);
    const [tableData, setTableData] = useState([]);

    /**
     * Formats experiments data into plot data, table data and 
     * plot interaction control object
     * @param {*} raw_experiments 
     * @returns 
     */
    const parseExperiments = (raw_experiments) => {
        let parsed = [];
        let plotData = {}; 
        let tableData = [];
        let csvData = [];
        let exp = [];
        
        // assign color and name to each experiment
        let colorIndex = 0;
        let uniqueDatasets = raw_experiments.map(item => item.dataset.name);
        uniqueDatasets = [...new Set(uniqueDatasets)];
        for(const dataset of uniqueDatasets){
            // Process each experiment by dataset.
            let filtered = raw_experiments.filter(item => item.dataset.name === dataset);
            
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
        parsed = parsed.map((item, i) => ({
            ...item, 
            id: i, // add id to each experiment so that it is easy to identify in the table and the plot.
            visible: true,
            displayCurve: typeof item.profile.AAC === 'number'
        }));

        plotData = getDoseResponseCurveData(parsed, true);
        tableData = parsed.map(item => ({
            id: item.id,
            name: item.name,
            dataset: item.dataset,
            cellLine: item.cell_line,
            compound: item.compound,
            ...item.profile
        }));
        exp = parsed.map((item) => ({
            id: item.id,
            name: item.name,
            dataset: item.dataset,
            cell_line: item.cell_line,
            compound: item.compound,
            color: item.color,
            displayCurve: item.displayCurve,
            visible: item.visible,
            clicked: {
                AAC: false,
                IC50: false,
                EC50: false,
                Einf: false
            }
        }));

        // parse CSV data
        for(const experiment of raw_experiments){
            experiment.dose_response.forEach(item => {
                csvData.push({
                    cell_line: experiment.cell_line.name,
                    compound: experiment.compound.name,
                    dataset: experiment.dataset.name,
                    dose: item.dose,
                    response: item.response
                });
            });
        }

        setExperiments(exp);
        setPlotData(plotData);
        setPlotCSVData(csvData);
        setTableData(tableData);
    };

    /**
     * Shows/hides dose response curves upon dataset checkbox click.
     * @param {*} e 
     */
    const handleDatasetSelectionChange = (e) => {
        let copy = [...plotData.traces];
        let ids = experiments.filter(item => item.name === e.target.value).map(item => item.id);
        copy.forEach(item => {
            if(ids.includes(item.id) && item.curve){
                item.visible = e.target.checked;
            }
        });
        let expCopy = [...experiments];
        expCopy.forEach(item => {
            if(item.name === e.target.value){
                item.visible = e.target.checked;
                if(!e.target.checked){
                    item.clicked.AAC = false;
                    item.clicked.IC50 = false;
                    item.clicked.EC50 = false;
                    item.clicked.Einf = false;
                }
            }
        });
        setExperiments(expCopy);
        setPlotData({
            ...plotData,
            traces: copy
        });
    };

    /**
     * Used in the stat summary table cell.
     * Show selected stat visualization in the dose response plot.
     * @param {*} id 
     * @param {*} statName 
     */
    const showStat = (id, statName) => {
        let copy = [...plotData.traces];
        copy.forEach(item => {
            if(item.id === id && item.stat === statName){
                if(statName === 'AAC' && item.curve){
                    item.fill = 'tonexty';
                }else{
                    item.visible = true;
                }
            }
        });
        setPlotData({
            ...plotData,
            traces: copy
        });
    };

    /**
     * Used in the stat summary table cell.
     * Hides stats visualizations from the dose resopnse plot.
     */
    const hideStat = () => {
        let copy = [...plotData.traces];
        copy.forEach(item => {
            let found = experiments.find(exp => exp.id === item.id);
            if(item.stat !== 'scatterPoints' && !found.clicked[item.stat]){
                if(item.curve){
                    item.fill = 'none';
                }else{
                    item.visible = false;
                }
            }
        });
        setPlotData({
            ...plotData,
            traces: copy
        });
    }

    /**
     * Used in stat summary table cell.
     * Keeps track of clicked cells in the table to keep the 
     * clicked stat visualizations.
     * @param {*} id 
     * @param {*} statName 
     */
    const alterClickedCells = (id, statName) => {
        let copy = [...experiments];
        let index = copy.findIndex(item => item.id === id);
        copy[index].clicked[statName] = !copy[index].clicked[statName];
        setExperiments(copy);
    };

    /**
     * Used in stat summary table cell.
     * Checks if a cell is clicked or not.
     * @param {*} id 
     * @param {*} statName 
     * @returns 
     */
    const isClicked = (id, statName) => {
        return experiments.find(item => item.id === id).clicked[statName];
    };

    /**
     * Used in stat summary table cell.
     * Checks if the cell needs to be disabled or not.
     * @param {*} id 
     * @returns 
     */
    const isDisabled = (id) => {
        return !experiments.find(item => item.id === id).visible;
    }

    /**
     * Returns link component for the main intersection page.
     * @param {*} datatype 
     * @returns 
     */
    const getLink = (datatype) => (
        <a href={`/${datatype}s/${experiments[0][datatype].id}`}>{experiments[0][datatype].name}</a>
    );

    return({
        experiments,
        plotData,
        plotCSVData,
        tableData,
        parseExperiments,
        handleDatasetSelectionChange,
        showStat,
        hideStat,
        alterClickedCells,
        isClicked,
        isDisabled,
        getLink
    });
}

export default useExpIntersection;