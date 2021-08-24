import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as venn from 'venn.js';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

const dimensions = {
    width: 600,
    height: 600,
}


// Inline style for the venn to align it in the center.
const vennStyle = {
    textAlign: 'center'
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
        .padding(50);
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
            0: { x: (dimensions.width) / 4, y: dimensions.height - 40 },
            1: { x: (dimensions.width * 2) / 3 - 20, y: dimensions.height - 40 },
            2: { x: 120, y: 80 },
        }
        : {
            0: { x: (dimensions.width) / 4, y: dimensions.height - 120 },
            1: { x: (dimensions.width * 2) / 3 - 20, y: dimensions.height - 120 },
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



const createVennDiagram = (data) => {
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
    enterData(chart, data, 'venn');

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


const VennDiagram = ({ data }) => {
    useEffect(() => {
        createVennDiagram(data)
    }, [data])

    return (
        <div id='venn' style={vennStyle} />
    )
};


VennDiagram.propTypes = {
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            sets: PropTypes.arrayOf(PropTypes.string).isRequired,
            size: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            values: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    ),
};

export default VennDiagram;
