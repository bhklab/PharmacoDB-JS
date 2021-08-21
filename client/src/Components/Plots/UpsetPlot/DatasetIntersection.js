import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import createAllSubsets from '../../../utils/createAllSubsets';
import UpsetPlot from './UpsetPlot';
import Loading from '../../UtilComponents/Loading';

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
            let result = [];
            if (subset.length === 1) {
                result = data[subset[0]];
            } else {
                result = subset.reduce((acc, cur) => {
                    if (typeof (acc) === "string") {
                        return data[acc].filter((el) => data[cur].includes(el));
                    } else {
                        return acc.filter((el) => data[cur].includes(el));
                    }
                });
            }

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
const DatasetIntersection = () => {
    // const datasetArray = ['CCLE', 'CTRPv2', 'gCSI'];
    const { loading, error, data } = useQuery(getCellLinesQuery);
    const [datasets, setDatasets] = useState([]);
    const [parsedCellData, setParsedCellData] = useState({});

    useEffect(() => {
        if (data) {
            const parsedCells = parseCellLineData(data.cell_lines);
            const datasetArray = Object.keys(parsedCells);
            const datasetSubSets = createAllSubsets(datasetArray);
            const subSetCells = createUpsetPlotData(parsedCells, datasetSubSets);
            setDatasets(datasetArray);
            setParsedCellData(subSetCells);
        }
    }, [data])

    return (
        loading ? <Loading /> : <UpsetPlot data={parsedCellData} datasets={datasets} />
        // datasets.length > 0 ? <UpsetPlot data={dataset} datasets={datasets1} /> : ''
    )
};

export default DatasetIntersection;
