import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import { getDatasetsQuery } from '../../../queries/dataset';
import createAllSubsets from '../../../utils/createAllSubsets';
import UpsetPlot from './UpsetPlot';
import VennDiagram from '../VennDiagram';
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
 * 
 * @param {Array | string} datasets - array or string of datasets.
 * @returns {Array} - an array of datasets in the upper case.
 */
const createDatasetArray = (datasets) => (
    typeof (datasets) === "string" ? datasets.split(',') : datasets
);


/**
 * 
 * @param {Array} datasets 
 * @param {Array} keys 
 */
const createUpdatedDatasetArray = (datasets, keys) => {
    let data = [];
    if (typeof (datasets) === 'object' && datasets.length > 0) {
        const regex = new RegExp(datasets.join('|'), 'i');
        data = keys.filter(key => key.match(regex));
    } else {
        data = keys;
    }
    return data;
};

/**
 * 
 * @param {boolean} cellDataLoading 
 * @param {boolean} datasetDataLoading 
 * @param {Object} parsedCellData 
 * @param {Array} updatedDatasets 
 */
const renderComponent = (cellDataLoading, datasetDataLoading, parsedCellData, updatedDatasets) => {
    if (cellDataLoading || datasetDataLoading) {
        return <Loading />
    } else {
        return <UpsetPlot data={parsedCellData} datasets={updatedDatasets} />
    }
}


/**
 * Parses data from the cell line query for the upset plot.
 * @component
 */
const DatasetIntersection = ({ datasets: datasetsProp }) => {
    // array of the datasets from the prop.
    const datasetsPropArray = createDatasetArray(datasetsProp);

    // cell line and dataset data from the APIs.
    const { loading: cellDataLoading, error: cellDataError, data: cellLineData } = useQuery(getCellLinesQuery);
    const { loading: datasetDataLoading, error: datasetDataError, data: datasetData } = useQuery(getDatasetsQuery);

    // setting the state to grab the updated dataset array and cell line data.
    const [updatedDatasets, setDatasets] = useState([]);
    const [parsedCellData, setParsedCellData] = useState({});

    useEffect(() => {
        if (cellLineData && datasetData) {
            // array of the datasets from the database and parsed cell line data.
            const datasets = datasetData.datasets.map(dataset => dataset.name);
            const parsedCells = parseCellLineData(cellLineData.cell_lines);

            // update the dataset names according to the names in the database.
            const updatedDatasetArray = createUpdatedDatasetArray(datasetsPropArray, datasets);

            // all the subsets of the dataset array and upset plot data for cell lines.
            const datasetSubSets = createAllSubsets(updatedDatasetArray);
            const subSetCells = createUpsetPlotData(parsedCells, datasetSubSets);

            // update the state to include a dataset list and 
            setDatasets(updatedDatasetArray);
            setParsedCellData(subSetCells);
        }
    }, [cellLineData, datasetData])

    return (
        <>
            {
                renderComponent(cellDataLoading, datasetDataLoading, parsedCellData, updatedDatasets)
            }
        </>
    )
};


DatasetIntersection.propTypes = {
    datasets: PropTypes.string,
}

export default DatasetIntersection;
