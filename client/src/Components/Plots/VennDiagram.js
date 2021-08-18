import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as venn from 'venn.js';

var sets = [
    { sets: ['A'], size: 20, label: '20' },
    { sets: ['B'], size: 20, label: '22' },
    { sets: ['C'], size: 20, label: '42' },
    { sets: ['A', 'B'], size: 6, label: '11' },
    { sets: ['A', 'C'], size: 6, label: '4' },
    { sets: ['C', 'B'], size: 6, label: '8' },
    { sets: ['C', 'B', 'A'], size: 4, label: '4' }
];

/**
 * Creates the venn diagram structure.
 * @param {number} width - width of the venn diagram.
 * @param {number} height - height of the venn diagram.
 * @param {number} fontSize - font size of the text in the venn diagram.
 */
const createVennDiagramStructure = (width = 500, height = 500, fontSize = '20px') => {
    return venn.VennDiagram()
        .width(width)
        .height(height)
        .fontSize(fontSize);
};

/**
 * Appends the data to the venn diagram.
 * @param {Object} chart - venn diagram object.
 * @param {Array} data - data array.
 * @param {string} id - div id to append the venn diagram to.
 */
const enterData = (chart, data, id = 'venn') => d3.select(`#${id}`).datum(data).call(chart);

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
const changeCirclesColor = (id, circleClass, color = '#205e74') => {
    d3.selectAll(`#${id} .${circleClass} path`)
        .style('fill', color)
        .style('fill-opacity', 0.9);
};

/**
 * 
 * @param {string} id - parent id for the venn diagram.
 * @param {string} circleClass - class for the main circles.
 * @param {string} color - color string.
 */
const changeIntersectionColor = (id, circleClass, color = '#a8ddb5') => {
    d3.selectAll(`#${id} .${circleClass} path`)
        .style('fill', color)
        .style('fill-opacity', 0.9);
};

/**
 * 
 * @param {string} attr - attribute to be choosen.
 * @param {string} color - color string.
 */
const changeInnerIntersectionColor = (attr, color = '#d94262') => {
    d3.select(`g[data-venn-sets=${attr}] path`)
        .style('fill', color)
        .style('fill-opacity', 0.9);
};



const createVennDiagram = (data) => {
    // creates the basic structure for the venn diagram.
    const chart = createVennDiagramStructure();

    // add the data to the venn diagram.
    enterData(chart, data, 'venn');

    // change the text color.
    changeText('venn', 'white');

    // change the color for the main circles.
    changeCirclesColor('venn', 'venn-circle', '#205e74')

    // change the color of the intersections.
    changeIntersectionColor('venn', 'venn-intersection', '#a8ddb5')

    // change the color of the intersection with 3 sets.
    changeInnerIntersectionColor('C_B_A', '#d94262')
};


const VennDiagram = () => {
    useEffect(() => {
        createVennDiagram(sets)
    }, [])
    return (
        <div id='venn' />
    )
};

export default VennDiagram;
