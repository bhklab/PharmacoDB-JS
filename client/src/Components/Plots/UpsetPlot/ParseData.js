import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import UpsetPlot from './UpsetPlot';

const datasets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
// create data for the upset plot.
const data = {
    set1: {
        keys: ['a', 'b', 'c'],
        values: ['x', 'y', 'z', 'd'],
    },
    set2: {
        keys: ['a'],
        values: ['x'],
    },
    set3: {
        keys: ['a', 'b'],
        values: ['x', 'y', 'z'],
    },
    set4: {
        keys: ['a', 'c'],
        values: ['x', 'y', 'd'],
    },
    set5: {
        keys: ['b', 'c'],
        values: ['x', 'y', 'z', 'd'],
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
        data ? <UpsetPlot data={data} datasets={datasets} /> : ''
    )
};

export default ParseData;
