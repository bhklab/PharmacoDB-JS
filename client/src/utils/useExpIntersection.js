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
    const [plotData, setPlotData] = useState({ traces: [], xMin: 0, xMax: 0, yMin: 0, yMax: 0 });
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
        for (const dataset of uniqueDatasets) {
            // Process each experiment by dataset.
            let filtered = raw_experiments.filter(item => item.dataset.name === dataset);

            // If multiple experiments (repeated) are present, assign them with number and similar colors.
            // If we ran out of colors, it'll default to the default color.
            if (filtered.length > 1) {
                let repeats = filtered.map((item, i) => ({
                    ...item,
                    experiment: { name: `${item.dataset.name} rep ${i + 1}` },
                    color: plotColors.gradients[colorIndex] ? plotColors.gradients[colorIndex][i <= 3 ? i : 3] : plotColors.default[3]
                }));
                parsed = parsed.concat(repeats);
                colorIndex++;
            } else {
                parsed.push({
                    ...filtered[0],
                    experiment: { name: filtered[0].dataset.name },
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
            displayCurve: typeof item.profile.AAC === 'number',
            defaultCurveWidth: isTissueCompound ? 0.5 : 2
        }));

        if (isTissueCompound) {
            // Parse cell lines and datasets data to control plot interactions
            let dsets = parsed.map(item => item.dataset.name);
            dsets = [...new Set(dsets)].map(item => ({
                name: item,
                checked: true,
                color: plotColors.default[0]
            }));
            dsets.sort((a, b) => a.name.localeCompare(b.name));

            let cellLineColors = [];
            for (let i = 0; i < 4; i++) {
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
                highlight: cells.find(cell => cell.name === experiment.cell_line.name).color
            }));
        }

        // get plot data
        plotData = getDoseResponseCurveData(parsed, showScatter);

        tableData = parsed.map(item => ({
            id: item.id,
            experiment: item.experiment,
            dataset: item.dataset,
            cell_line: item.cell_line,
            compound: item.compound,
            tissue: item.tissue,
            ...item.profile
        }));
        tableData = tableData.filter(item => typeof item.AAC === 'number');

        exp = parsed.map((item) => ({
            id: item.id,
            experiment: item.experiment,
            dataset: item.dataset,
            cell_line: { ...item.cell_line, uid: item.cell_line.cell_uid },
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
        for (const experiment of parsed) {
            experiment.dose_response.forEach(item => {
                let row = isTissueCompound ? { tissue: experiment.tissue.name } : {};
                row.cell_line = experiment.cell_line.name;
                row.compound = experiment.compound.name;
                row.dataset = experiment.dataset.name;
                row.dataset_experiment = experiment.experiment.name;
                row.dose = item.dose;
                row.response = item.response;
                csvData.push(row);
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
     * Filteres and prepares plot traces (lines) to be rendered on plot, upon interactions 
     * such as table cell hover, cell clicks, and checkbox clicks.
     * @param {Array} visibleExpIds // experiments that are visible in the plot
     * @param {Array} highlightedCells // cells that are highlighted (used only in tissue vs compound page)
     * @param {number} id // experiment id of a hovered table cell (used only for table cell hover)
     * @param {string} statName // stat name of a hovered cell (used only for table cell hover)
     * @returns visible traces to be rendered on plot.
     */
    const getNewTraces = (visibleExpIds, highlightedCells = [], id = undefined, statName = undefined) => {
        // Get all traces that belong to visible experiments.
        // Scatterpoints are always visible if available.
        let newTraces = traces.filter(item => visibleExpIds.includes(item.id) || item.stat === 'scatterPoints');

        // Set traces to be visible or invisible depending on the type of traces.
        // For example, scatter points for cell line vs drug plot should always be visible, while 
        // Stat traces such as IC50 should only be visible if the IC50 of the specific experiment has been clicked.
        newTraces = newTraces.map(item => {
            let found = experiments.find(exp => exp.id === item.id);
            if (item.curve) {
                // Keep cell line highlight if cell line checkbox for the experiment is checked.
                // Applicable only in tissue vs. compound page
                item.line.width = highlightedCells.includes(found.cell_line.name) ? 3 : item.defaultCurveWidth;
                item.line.color = highlightedCells.includes(found.cell_line.name) ? item.highlight : item.color;

                // If AAC cell is hovered or clicked, then keep it as visible.
                if ((statName === 'AAC' && item.id === id) || found.clicked.AAC) {
                    item.fill = 'tonexty';
                    item.line.color = item.highlight ? item.highlight : item.color;
                } else {
                    item.fill = 'none';
                    item.line.color = highlightedCells.includes(found.cell_line.name) ? item.highlight : item.color;
                }
                return item;
            }
            // Always keep scatterPoints visible if available (cell line vs compound page only)
            if (item.stat === 'scatterPoints') {
                item.visible = true;
                return item;
            }
            // Show or hide the hovered stat visualization.
            if (item.id === id && item.stat === statName) {
                item.visible = true;
                return item;
            }
            // Keep any other clicked stat such as IC50 visible.
            if (found.clicked[item.stat]) {
                item.visible = true;
                return item;
            }
            item.visible = false;
            return item;
        });
        // Return traces that are set to be visible only.
        return newTraces.filter(item => item.visible);
    }

    /**
     * Shows/hides dose response curves upon experiment / dataset checkbox click.
     * @param {*} e checkbox click event
     * @param {string} curveType // accepts either 'experiment' (used in cell line vs compound) or 'dataset' (used in tissue vs compound)
     */
    const showHideCurve = (e, curveType) => {
        //Set the experiments that belong to the clicked dataset to either visible or invisible
        let newExp = experiments.map(item => {
            if (item[curveType].name === e.target.value) {
                let newItem = {
                    ...item,
                    visible: e.target.checked
                }
                // If the experiment is unchecked, hide all the stat visualizations.
                if (!e.target.checked) {
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

        // Get ids of experiments that should be visible.
        let visibleExpIds = newExp.filter(item => item.visible).map(item => item.id);

        // Get highlighted cell lines.
        let highlightedCells = curveType === 'dataset' ? cellLines.filter(item => item.checked).map(item => item.name) : [];

        if (curveType === 'dataset') {
            // Enable/disable cell line selector options depending on the dataset selection.
            let otherCells = [...new Set(newExp.filter(item => item.visible).map(item => item.cell_line.name))];
            let cellOptions = cellLines.map(item => ({
                ...item,
                disabled: !otherCells.includes(item.name)
            }));
            setCellLines(cellOptions);
        }

        setExperiments(newExp);
        setPlotData({
            ...plotData,
            traces: getNewTraces(visibleExpIds, highlightedCells)
        });
    };

    /**
     * Highlights / unhighlights dose response curves upon cell line checkbox click.
     * Used in tissue vs compound page.
     * @param {*} e 
     */
    const handleCellLineSelectionChange = (e) => {
        // Mark checked cell line as checked.
        let newCellLines = cellLines.map(item => {
            if (item.name === e.target.value) {
                return {
                    ...item,
                    checked: e.target.checked
                }
            }
            return item;
        });

        // Get ids of experiments that should be visible.
        // This needs to be done since some experiments might be de-selected through checkbox filtering.
        let visibleExpIds = experiments.filter(item => item.visible).map(item => item.id);

        // Get highlighted cell lines.
        let highlightedCells = newCellLines.filter(item => item.checked).map(item => item.name);

        setCellLines(newCellLines);
        setPlotData({
            ...plotData,
            traces: getNewTraces(visibleExpIds, highlightedCells)
        });
    };

    /**
     * Used in the stat summary table cell.
     * Show selected stat visualization in the dose response plot.
     * @param {*} id 
     * @param {*} statName 
     */
    const showStat = (id, statName) => {
        // Get ids of experiments that should be visible.
        // This needs to be done since some experiments might be de-selected through checkbox filtering.
        let visibleExpIds = experiments.filter(item => item.visible).map(item => item.id);

        // Get highlighted cell lines.
        let highlightedCells = cellLines.filter(item => item.checked).map(item => item.name);

        setPlotData({
            ...plotData,
            traces: getNewTraces(visibleExpIds, highlightedCells, id, statName)
        });
    };

    /**
     * Used in the stat summary table cell.
     * Hides stats visualizations from the dose resopnse plot.
     */
    const hideStat = () => {
        // Get ids of experiments that should be visible.
        // This needs to be done since some experiments might be de-selected through checkbox filtering.
        let visibleExpIds = experiments.filter(item => item.visible).map(item => item.id);

        // Get highlighted cell lines.
        let highlightedCells = cellLines.filter(item => item.checked).map(item => item.name);

        setPlotData({
            ...plotData,
            traces: getNewTraces(visibleExpIds, highlightedCells)
        });
    };

    /**
     * Modifies the plot traces on curve click (highlighted or unhighlighted)
     * Check/uncheck highlighted/unhighlighted cell line checkbox.
     * Used in tissue vs compound page.
     * @param {*} e 
     */
    const onCurveClick = (e) => {
        let selectedCell = experiments.find(item => item.id === e.points[0].data.id).cell_line.name;
        let expIds = experiments.filter(item => item.cell_line.name === selectedCell).map(item => item.id);
        let newTraces = plotData.traces.map(item => {
            if (item.curve && expIds.includes(item.id)) {
                let newItem = { ...item };
                newItem.line.width = newItem.line.width === 0.5 ? 3 : 0.5;
                newItem.line.color = newItem.line.color === newItem.color ? newItem.highlight : newItem.color;
            }
            return item;
        });
        // Check/uncheck cell line checkbox if a seleted cell line that belongs to clicked experiment curve.
        let newCellLines = cellLines.map(item => {
            if(item.name === selectedCell){
                return {
                    ...item,
                    checked: !item.checked
                }
            }
            return item;
        });
        setCellLines(newCellLines);
        setPlotData({
            ...plotData,
            traces: newTraces
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
     * Checks if a table cell is clicked or not.
     * @param {*} id 
     * @param {*} statName 
     * @returns 
     */
    const isClicked = (id, statName) => {
        return experiments.find(item => item.id === id).clicked[statName];
    };

    /**
     * Used in stat summary table cell.
     * Checks if the table cell needs to be disabled or not.
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
        <a href={`/${datatype}s/${datatype === 'tissue' ? experiments[0][datatype].id : experiments[0][datatype].uid}`}>{experiments[0][datatype].name}</a>
    );

    return ({
        experiments,
        datasets,
        cellLines,
        plotData,
        traces,
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
    });
}

export default useExpIntersection;