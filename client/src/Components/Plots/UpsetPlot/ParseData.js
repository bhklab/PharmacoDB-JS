import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import UpsetPlot from './UpsetPlot';

const datasets1 = ["gCSI", "GDSC_v1", "CCLE", "CTRPv2", "UHNBreast", "GRAY", "FIMM"];
// create data for the upset plot.
const dataset = {
    set1: {
        keys: ['CCLE', 'CTRPv2', 'FIMM'],
        values: ['x', 'y', 'z', 'd'],
        count: 4,
    },
    set2: {
        keys: ['CCLE'],
        values: ['x'],
        count: 1,
    },
    set3: {
        keys: ['CCLE', 'CTRPv2'],
        values: ['x', 'y', 'z'],
        count: 3,
    },
    set4: {
        keys: ['CCLE', 'FIMM'],
        values: ['x', 'y', 'd'],
        count: 3,
    },
    set5: {
        keys: ['CTRPv2', 'FIMM'],
        values: ['x', 'y', 'z', 'd', 'p'],
        count: 5,
    },
    set6: {
        keys: ['CTRPv2', 'FIMM'],
        values: ['x', 'y'],
        count: 2,
    },
    set7: {
        keys: ['CTRPv2', 'UHNBreast'],
        values: ['x', 'y', 'z'],
        count: 3,
    },
    set8: {
        keys: ['CTRPv2', 'GRAY'],
        values: ['x', 'y', 'z', 'd'],
        count: 4,
    },
}

/**
 * 
 * @param {Array} data - input data that has to be parsed.
 */
const parseCellLineData = (data) => {
    // object to store the final result.
    let dataObject = {};
    // iterate through the data to prepare the data Object.
    data.forEach((element) => {
        if (dataObject[element.dataset.name]) {
            dataObject[element.dataset.name].push(element.name);
        } else {
            dataObject[element.dataset.name] = [element.name];
        }
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
        const uniqueValues = [];
        if (subset.length > 0) {
            // union of the data.
            // subset.forEach(el => uniqueValues.push(...data[el]));

            // intersection
            const result = subset.reduce((acc, cur) => {
                if (typeof (acc) === "string") {
                    console.log(data[acc].filter((el) => data[cur].includes(el)));
                    return data[acc].filter((el) => data[cur].includes(el));
                } else {
                    return acc.filter((el) => data[cur].includes(el));
                }
            });

            // append the object to final object variable.
            finalObject[`set${i}`] = {
                keys: subset,
                values: [...new Set(uniqueValues)],
                count: uniqueValues.length,
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
        // datasets.length > 0 ? <UpsetPlot data={parsedCellData} datasets={datasets} /> : ''
        datasets.length > 0 ? <UpsetPlot data={dataset} datasets={datasets1} /> : ''
    )
};

export default ParseData;
