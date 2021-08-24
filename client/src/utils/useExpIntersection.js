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
    const [datasets, setDatasets] = useState([]);
    const [cellLines, setCellLines] = useState([]);
    const [plotData, setPlotData] = useState({traces: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0});
    const [traces, setTraces] = useState([]); // contains all traces
    const [plotCSVData, setPlotCSVData] = useState([]);
    const [tableData, setTableData] = useState([]);

    /**
     * Formats experiments data into plot data, table data and 
     * plot interaction control object
     * @param {*} raw_experiments 
     * @returns 
     */
    const parseExperiments = (raw_experiments, showScatter, isTissueCompound) => {
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
                    experiment: {name: `${item.dataset.name} rep ${i + 1}`},
                    color: plotColors.gradients[colorIndex] ? plotColors.gradients[colorIndex][i <= 3 ? i : 3] : plotColors.default[3]
                }));
                parsed = parsed.concat(repeats);
                colorIndex++;
            }else{
                parsed.push({
                    ...filtered[0],
                    experiment: {name: filtered[0].dataset.name},
                    color: plotColors.gradients[colorIndex] ? plotColors.gradients[colorIndex][0] : plotColors.default[0]
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

        if(isTissueCompound){
            // Parse cell lines and datasets data to control plot interactions
            let dsets = parsed.map(item => item.dataset.name);
            dsets = [...new Set(dsets)].map(item => ({
                name: item,
                checked: true,
                color: plotColors.default[0]
            }));
            dsets.sort((a, b) => a.name.localeCompare(b.name));
            
            let cellLineColors = [];
            for(let i = 0; i < 4; i++){
                let col = plotColors.gradients.map(item => item[i]);
                cellLineColors = cellLineColors.concat(col);
            }
            let cells = parsed.map(item => item.cell_line.name);
            cells.sort((a, b) => a.localeCompare(b));
            cells = [...new Set(cells)].map((item, i) => ({
                name: item,
                checked: false,
                disabled: false,
                color: i < cellLineColors.length ? cellLineColors[i] : plotColors.default[1]
            }));
            setDatasets(dsets);
            setCellLines(cells);
            parsed = parsed.map(experiment => ({
                ...experiment,
                color: plotColors.default[0],
                highlight: cells.find(cell => cell.name === experiment.cell_line.name).color,
                curveWidth: 0.5
            }));
        }

        // get plot data
        plotData = getDoseResponseCurveData(parsed, showScatter);

        tableData = parsed.map(item => ({
            id: item.id,
            dataset: item.dataset,
            cell_line: item.cell_line,
            compound: item.compound,
            tissue: item.tissue,
            ...item.profile
        }));

        exp = parsed.map((item) => ({
            id: item.id,
            experiment: item.experiment,
            dataset: item.dataset,
            cell_line: item.cell_line,
            compound: item.compound,
            tissue: item.tissue,
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
        setPlotData({
            traces: plotData.traces.filter(item => item.curve || item.stat === 'scatterPoints'),
            xMin: plotData.xMin, 
            xMax: plotData.xMax, 
            yMin: plotData.yMin, 
            yMax: plotData.yMax
        });
        setTraces(plotData.traces);
        setPlotCSVData(csvData);
        setTableData(tableData);
    };

    /**
     * Shows/hides dose response curves upon experiment checkbox click.
     * Used in cell line vs compound page.
     * @param {*} e 
     */
    const handleExperimentSelectionChange = (e) => {
        let ids = experiments.filter(item => item.experiment.name === e.target.value).map(item => item.id);
        let newTraces = traces.map(item => {
            if(ids.includes(item.id) && item.curve){
                item.visible = e.target.checked;
                return {
                    ...item,
                    visible: e.target.checked
                }
            }
            return item;
        });
        let newExp = experiments.map(item => {
            if(item.experiment.name === e.target.value){
                let newItem = {...item}
                newItem.visible = e.target.checked;
                if(!e.target.checked){
                    newItem.clicked = {
                        AAC: false,
                        IC50: false,
                        EC50: false,
                        Einf: false
                    }
                }
                return newItem;
            }
            return item;
        });
        setExperiments(newExp);
        setTraces(newTraces);
    };

    /**
     * Shows/hides dose response curves upon dataset checkbox click.
     * Used in tissue vs compound page.
     * @param {*} e 
     */
    const handleDatasetSelectionChange = (e) => {
        let ids = experiments.filter(item => item.dataset.name === e.target.value).map(item => item.id);

        let newTraces = traces.map(item => {
            if(ids.includes(item.id) && item.curve){
                return {
                    ...item,
                    visible: e.target.checked
                }
            }
            return item;
        });

        let newExp = experiments.map(item => {
            if(ids.includes(item.id)){
                return {
                    ...item,
                    visible: e.target.checked
                }
            }
            return item;
        });

        // Enable/disable cell line selector options depending on the dataset selection.
        let otherCells = [...new Set(newExp.filter(item => item.visible).map(item => item.cell_line.name))];
        let cellOptions = cellLines.map(item => ({
            ...item,
            disabled: !otherCells.includes(item.name)
        }));

        setCellLines(cellOptions);
        setExperiments(newExp);
        setTraces(newTraces);
    };

    /**
     * Shows/hides dose response curves upon cell line checkbox click.
     * Used in tissue vs compound page.
     * @param {*} e 
     */
    const handleCellLineSelectionChange = (e) => {
        let filteredExpIds = experiments.filter(item => item.cell_line.name === e.target.value).map(item => item.id);
        let newTraces = traces.map(item => {
            if(item.curve && filteredExpIds.includes(item.id)){
                return {
                    ...item,
                    line: {
                        width: e.target.checked ? 2 : 0.5,
                        color: e.target.checked ? item.highlight : item.color
                    }
                }
            }
            return item;
        })
        setTraces(newTraces);
    };

    /**
     * Used in the stat summary table cell.
     * Show selected stat visualization in the dose response plot.
     * @param {*} id 
     * @param {*} statName 
     */
    const showStat = (id, statName) => {
        // let newTraces = traces.map(item => {
        //     if(item.id === id && item.stat === statName){
        //         let newItem = {...item}
        //         if(statName === 'AAC' && newItem.curve){
        //             newItem.fill = 'tonexty';
        //             newItem.line.color = newItem.highlight ? newItem.highlight : newItem.color;
        //         }else{
        //             newItem.visible = true;
        //         }
        //         return newItem;
        //     }
        //     return item;
        // });
        // setTraces(newTraces);
        let newTraces = traces.filter(
                item => item.curve || 
                item.id === id && item.stat === statName ||
                item.stat === 'scatterPoints'
            );
        newTraces.forEach(item => {
            if(item.id === id && item.stat === statName){
                if(statName === 'AAC' && item.curve){
                    item.fill = 'tonexty';
                    item.line.color = item.highlight ? item.highlight : item.color;
                }else{
                    item.visible = true;
                }
            }
        });
        setPlotData({
            ...plotData,
            traces: newTraces
        });
    };

    /**
     * Used in the stat summary table cell.
     * Hides stats visualizations from the dose resopnse plot.
     */
    const hideStat = () => {
        // let newTraces = traces.map(item => {
        //     let found = experiments.find(exp => exp.id === item.id);
        //     if(item.stat !== 'scatterPoints' && !found.clicked[item.stat]){
        //         let newItem = {...item};
        //         if(newItem.curve){
        //             newItem.fill = 'none';
        //             newItem.line.color = newItem.color;
        //         }else{
        //             newItem.visible = false;
        //         }
        //         return newItem;
        //     }
        //     return item;
        // });
        // setTraces(newTraces);
        let newTraces = traces.filter(
            item => item.curve || 
            item.stat === 'scatterPoints'
        );
        newTraces.forEach(item => {
                if(item.curve){
                    item.fill = 'none';
                    item.line.color = item.color;
                }
        });
        setPlotData({
            ...plotData,
            traces: newTraces
        });
    };

    /**
     * Modify the plot traces on curve click.
     * Used in tissue vs compound page.
     * @param {*} e 
     */
    const onCurveClick = (e) => {
        console.log(e.points[0].data.id);
        let cell = experiments.find(item => item.id === e.points[0].data.id).cell_line.name;
        let expIds = experiments.filter(item => item.cell_line.name === cell).map(item => item.id);
        let newTraces = traces.map(item => {
            if(item.curve && expIds.includes(item.id)){
                let newItem = {...item};
                newItem.line.width = newItem.line.width === 0.5 ? 2 : 0.5;
                newItem.line.color = newItem.line.color === newItem.color ? newItem.highlight : newItem.color;
            }
            return item;
        });
        setTraces(newTraces);
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
        datasets,
        cellLines,
        plotData,
        traces,
        plotCSVData,
        tableData,
        parseExperiments,
        handleExperimentSelectionChange,
        handleDatasetSelectionChange,
        handleCellLineSelectionChange,
        showStat,
        hideStat,
        onCurveClick,
        alterClickedCells,
        isClicked,
        isDisabled,
        getLink
    });
}

export default useExpIntersection;