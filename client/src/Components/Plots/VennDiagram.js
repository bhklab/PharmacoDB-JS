import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import * as d3 from 'd3';
import * as venn from 'venn.js';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import styled from 'styled-components';
import Table from '../UtilComponents/Table/Table';

// venn component styles
const VennContainer = styled.div`
    display: flex;
    flex-direction: column;

    .venn-select-container {
        width: 250px;
        align-self: flex-end;
    }

    #venn {
        align-self: center;
    }

    .venn-description {
        color: ${colors.dark_pink_highlight};
        margin-top: 0px;
        margin-bottom: 20px;
        text-align: center;
        font-style: italic;

        span {
            font-weight: 700;
        }
    }
`;

// dimensions for the venn plot
const dimensions = {
    width: 600,
    height: 400,
}

/**
 * Creates the venn diagram structure.
 * @param {number} width - width of the venn diagram.
 * @param {number} height - height of the venn diagram.
 * @param {number} fontSize - font size of the text in the venn diagram.
 */
const createVennDiagramStructure = (width = dimensions.width, height = dimensions.height, fontSize = '18px') => {
    return venn.VennDiagram()
        .width(width)
        .height(height)
        .fontSize(fontSize)
        .padding(20);
};

/**
 * Appends the data to the venn diagram.
 * @param {Object} chart - venn diagram object.
 * @param {Array} data - data array.
 * @param {string} id - div id to append the venn diagram to.
 */
const enterData = (chart, data, id = 'venn', updateSelectedData) => d3.select(`#${id}`)
    .datum(data)
    .call(chart)
    .on('mouseover', function () {
        // change the cursor type.
        d3.select(this).style('cursor', 'pointer')
    })
    .on('mouseout', function () {
        // change the cursor to default.
        d3.select(this).style('cursor', 'default');
    })
    .on('click', function (d) { 
        updateSelectedData(d.target.__data__.values);
    });

/**
 * Changes the text color.
 * @param {string} id - parent id for the venn diagram.
 * @param {string} color - color for the text.
 */
const changeText = (id = 'venn', color = 'white') => {
    d3.selectAll(`#${id} text`)
        .style('fill', color);
};

/**
 * 
 * @param {string} id - parent id for the venn diagram.
 * @param {string} circleClass - class for the main circles.
 * @param {string} color - color string.
 */
const changeCirclesColor = (id, circleClass, color = `${colors.dark_teal_heading}`) => {
    d3.selectAll(`#${id} .${circleClass} path`)
        .style('fill', color)
        .style('fill-opacity', 0.80);
};

/**
 * 
 * @param {string} id - parent id for the venn diagram.
 * @param {string} circleClass - class for the main circles.
 * @param {string} color - color string.
 */
const changeIntersectionColor = (id, circleClass, color = `${colors.green}`) => {
    d3.selectAll(`#${id} .${circleClass} path`)
        .style('fill', color)
        .style('fill-opacity', 0.80);
};

/**
 * 
 * @param {string} attr - attribute to be choosen.
 * @param {string} color - color string.
 */
const changeInnerIntersectionColor = (attr, color = `${colors.dark_pink_highlight}`) => {
    d3.select(`g[data-venn-sets=${attr}] path`)
        .style('fill', color)
        .style('fill-opacity', 0.80);
};

/**
 * append text with the dataset information and total number of a particular data type.
 * @param {Array} data 
 */
const appendText = (data) => {
    // selecting svg element and adding a g element with id.
    const svg = d3.select('#venn svg')
        .append('g')
        .attr('id', 'text-label');

    // position of the text based on data length (2^2-1 or 2^3-1).
    const location = data.length === 7 || data.length === 8
        ? {
            0: { x: (dimensions.width) / 4, y: dimensions.height - 30 },
            1: { x: (dimensions.width * 2) / 3 - 20, y: dimensions.height - 30 },
            2: { x: 100, y: 80 },
        }
        : {
            0: { x: (dimensions.width) / 4, y: dimensions.height - 70 },
            1: { x: (dimensions.width * 2) / 3 - 20, y: dimensions.height - 70 },
        };

    // appends the text.
    let count = 0;
    data.forEach((el) => {
        if (el.sets.length === 1) {
            svg
                .append('text')
                .attr('x', location[count]['x'])
                .attr('y', location[count]['y'])
                .attr('stroke', `${colors.dark_teal_heading}`)
                .style('font-size', 14)
                .style('font-weight', 500)
                .text(`${el.sets.join('+')} (${el.label})`);
            count += 1;
        };
    })
}



const createVennDiagram = (data, updateSelectedData) => {
    // remove the existing svg element.
    d3.select('#venn svg').remove();
    
    // get the set and concat it in case the set size is three (3).
    let innerInstersection = '';

    data.forEach(el => {
        if (el.sets.length === 3) {
            innerInstersection = el.sets.join('_');
        }
    });

    // creates the basic structure for the venn diagram.
    const chart = createVennDiagramStructure();

    // add the data to the venn diagram.
    enterData(chart, data, 'venn', updateSelectedData);

    // change the text color.
    changeText('venn', 'white');

    // change the color for the main circles.
    changeCirclesColor('venn', 'venn-circle', `${colors.dark_teal_heading}`)

    // change the color of the intersections.
    changeIntersectionColor('venn', 'venn-intersection', `${colors.green}`)

    // change the color of the intersection with 3 sets.
    if (innerInstersection !== '') {
        changeInnerIntersectionColor(innerInstersection, `${colors.dark_pink_highlight}`)
    }

    // append text to the individual circles.
    appendText(data);
};

/**
 * create table for list of types
 */
 function makeTable(data) {
    // an array with the columns of dataset table.
    const tableColumns = [
        {
            Header: 'Name',
            accessor: 'name',
            center: true,
            rowSpan: 2,
        },
    ];

    const tableData = data.map(el => ({id: el, name: el}));
    return <Table columns={tableColumns} data={tableData}/>
};


const VennDiagram = ({ tissueData, cellData, compoundData, selectOptions }) => {
    // select data type; by default cell line
    const [selectedType, setSelectedType] = useState('Cell Line');
    const [selectedData, updateSelectedData] = useState();

    useEffect(() => {
        if(selectedType === 'Cell Line') {
            createVennDiagram(cellData, updateSelectedData);
        }

        if(selectedType === 'Tissue') {
            createVennDiagram(tissueData, updateSelectedData);
        }

        if(selectedType === 'Compound') {
            createVennDiagram(compoundData, updateSelectedData);
        }
    }, [selectedType])

    return (
       <VennContainer>
            <div className='venn-select-container'>
                <Select 
                    className='venn-select'
                    defaultValue={{ value: selectedType, label: selectedType }}
                    options={selectOptions} 
                    onChange={(e) => setSelectedType(e.label)}
                />
            </div>
            <div id='venn'/>
            <div className='venn-description'>
                <span> Note: </span>
                Numbers represent total members of intersection, 
                not excluding those in other intersections, 
                unlike a usual Venn Diagram.
            </div>
            {
                selectedData ? <div> {makeTable(selectedData)} </div> : <div/>
            }
        </VennContainer>
    )
};


VennDiagram.propTypes = {
    tissueData: PropTypes.arrayOf(
        PropTypes.shape({
            sets: PropTypes.arrayOf(PropTypes.string).isRequired,
            size: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    ),
    compoundData: PropTypes.arrayOf(
        PropTypes.shape({
            sets: PropTypes.arrayOf(PropTypes.string).isRequired,
            size: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    ),
    cellData: PropTypes.arrayOf(
        PropTypes.shape({
            sets: PropTypes.arrayOf(PropTypes.string).isRequired,
            size: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    ),
    selectOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
    })).isRequired,
};

export default VennDiagram;