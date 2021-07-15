import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import UpsetPlot from './UpsetPlot';


/**
 * Parses the data and prepare an object for each dataset and all the related types in the dataset.
 * @param {Array} data - input data that has to be parsed.
 */
const parseCellLineData = (data) => {
    // object to store the final result.
    let dataObject = {};
    // iterate through the data to prepare the data Object.
    data.forEach((element) => {
        element.dataset.forEach(dataset => {
            if (!dataObject[dataset.name]) {
                dataObject[dataset.name] = [element.name]
            } else if (dataObject[dataset.name]) {
                dataObject[dataset.name].push(element.name);
            }
        })
    });
    // this is set each key to unique list of data type.
    Object.keys(dataObject).forEach((key) => {
        dataObject[key] = [...new Set(dataObject[key])]
    })
    return dataObject;
};

/**
 * List all the subsets of a set.
 * @param {Array} set 
 * @param {number} set_size 
 */
const createAllSubsets = (set, set_size) => {
    //set_size of power set of a set with set_size n is (2**n -1)
    let powSetSize = parseInt(Math.pow(2, set_size));
    let finalSubsets = [];

    // Run from counter 000..0 to 111..1
    for (let counter = 0; counter < powSetSize; counter++) {
        let subset = [];
        for (let j = 0; j < set_size; j++) {
            // Check if jth bit in the counter is set If set then print jth element from set
            if ((counter & (1 << j)) > 0) {
                subset.push(set[j]);
            }
        }
        finalSubsets.push(subset);
    }
    return finalSubsets;
};

/**
 * 
 * @param {Object} data - input data.
 * @param {Array} subsets - list of all the subsets.
 */
const createUpsetPlotData = (data, subsets) => {
    const finalObject = {};
    subsets.forEach((subset, i) => {
        if (subset.length > 0) {
            // union of the data.
            // subset.forEach(el => uniqueValues.push(...data[el]));
            // intersection
            const result = subset.reduce((acc, cur) => {
                if (typeof (acc) === "string") {
                    return data[acc].filter((el) => data[cur].includes(el));
                } else {
                    return acc.filter((el) => data[cur].includes(el));
                }
            });
            // append the object to final object variable.
            finalObject[`set${i}`] = {
                keys: subset,
                values: [...new Set(result)],
                count: result.length,
            }
        }
    })
    return finalObject;
};


/**
 * Parses data from the cell line query for the upset plot.
 * @component
 */
const ParseData = () => {
    const { loading, error, data } = useQuery(getCellLinesQuery);
    const [datasets, setDatasets] = useState([]);
    const [parsedCellData, setParsedCellData] = useState({});

    useEffect(() => {
        if (data) {
            const parsedCells = parseCellLineData(data.cell_lines);
            const datasetArray = Object.keys(parsedCells);
            const datasetSubSets = createAllSubsets(datasetArray, datasetArray.length);
            const subSetCells = createUpsetPlotData(parsedCells, datasetSubSets);
            setDatasets(datasetArray);
            setParsedCellData(subSetCells);
        }
    }, [data])

    return (
        datasets.length > 0 ? <UpsetPlot data={parsedCellData} datasets={datasets} /> : ''
        // datasets.length > 0 ? <UpsetPlot data={dataset} datasets={datasets1} /> : ''
    )
};

export default ParseData;
