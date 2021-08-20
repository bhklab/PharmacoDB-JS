import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as venn from 'venn.js';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import colors from '../../styles/colors';

var sets = [
    { sets: ['A'], size: 20, label: '20' },
    { sets: ['B'], size: 20, label: '22' },
    { sets: ['C'], size: 20, label: '42' },
    { sets: ['A', 'B'], size: 6, label: '11' },
    { sets: ['A', 'C'], size: 6, label: '4' },
    { sets: ['C', 'B'], size: 6, label: '8' },
    { sets: ['C', 'B', 'A'], size: 4, label: '4' }
];

// Inline style for the venn to align it in the center.
const vennStyle = { textAlign: 'center' }

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
const changeCirclesColor = (id, circleClass, color = `${colors.dark_teal_heading}`) => {
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
const changeIntersectionColor = (id, circleClass, color = `${colors.green}`) => {
    d3.selectAll(`#${id} .${circleClass} path`)
        .style('fill', color)
        .style('fill-opacity', 0.9);
};

/**
 * 
 * @param {string} attr - attribute to be choosen.
 * @param {string} color - color string.
 */
const changeInnerIntersectionColor = (attr, color = `${colors.dark_pink_highlight}`) => {
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
    changeCirclesColor('venn', 'venn-circle', `${colors.dark_teal_heading}`)

    // change the color of the intersections.
    changeIntersectionColor('venn', 'venn-intersection', `${colors.green}`)

    // change the color of the intersection with 3 sets.
    changeInnerIntersectionColor('C_B_A', `${colors.dark_pink_highlight}`)
};


const VennDiagram = (props) => {
    useEffect(() => {
        createVennDiagram(sets)
    }, [])
    return (
        <Layout page='venn_diagram'>
            <StyledWrapper>
                <div id='venn' style={vennStyle} />
            </StyledWrapper>
        </Layout>
    )
};

export default VennDiagram;
