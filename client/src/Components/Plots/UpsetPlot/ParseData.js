import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import UpsetPlot from './UpsetPlot';

const datasets = ['CCLE', 'CTRPV2', 'FIMM', 'gCSI', 'GDSC1000', 'GRAY', 'UHNBreast'];
// create data for the upset plot.
const dataset = {
    set1: {
        keys: ['CCLE', 'CTRPV2', 'FIMM'],
        values: ['x', 'y', 'z', 'd'],
        count: 4,
    },
    set2: {
        keys: ['CCLE'],
        values: ['x'],
        count: 1,
    },
    set3: {
        keys: ['CCLE', 'CTRPV2'],
        values: ['x', 'y', 'z'],
        count: 3,
    },
    set4: {
        keys: ['CCLE', 'FIMM'],
        values: ['x', 'y', 'd'],
        count: 3,
    },
    set5: {
        keys: ['CTRPV2', 'FIMM'],
        values: ['x', 'y', 'z', 'd', 'p'],
        count: 5,
    },
    set6: {
        keys: ['CTRPV2', 'FIMM'],
        values: ['x', 'y', 'z', 'd', 'p'],
        count: 5,
    },
}


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
}

/**
 * Parses data from the cell line query for the upset plot.
 * @component
 */
const ParseData = () => {
    const { loading, error, data } = useQuery(getCellLinesQuery);
    if (data) {
        parseCellLineData(data.cell_lines);
    }

    return (
        data ? <UpsetPlot data={dataset} datasets={datasets} /> : ''
    )
};

export default ParseData;
