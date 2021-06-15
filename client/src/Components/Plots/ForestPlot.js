import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import createSvgCanvas from '../../utils/createSvgCanvas';
import colors from '../../styles/colors';

const MULTIPLIER = 1.96;

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}

// width and height of the SVG canvas.
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// calculates the minimum and maximum estimate from the data.
const minEstimate = Math.min(...data.map(val => val.estimate));
const maxEstimate = Math.max(...data.map(val => val.estimate));

// calculates the minimum and maximum standard error from the data.
const minStandardError = Math.min(...data.map(val => val.se));
const maxStandardError = Math.max(...data.map(val => val.se));

/**
 * @returns - d3 linear scale for x-axis.
 */
const createXScale = () => (
    d3.scaleLinear()
        .domain([minEstimate - MULTIPLIER * maxStandardError, maxEstimate + MULTIPLIER * maxStandardError])
        .range([0, width])
        .nice()
);

/**
 * Appends x-axis to the main svg element.
 * @param {Object} svg - svg selection.
 */
const createXAxis = (svg) => {
    const xAxis = svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        // .style('stroke', `${colors.dark_gray_text}`)
        .call(d3.axisBottom(createXScale()))
};

/**
 * Creates a vertical main line for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createVerticalLine = (svg, scale) => {
    svg.append('g')
        .attr('id', 'vertical-line')
        .append('line')
        .style('stroke', `${colors.dark_gray_text}`)
        .attr('x1', scale(0))
        .attr("y1", 0)
        .attr("x2", scale(0))
        .attr("y2", height);
}

/**
 * Creates horizontal lines for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createHorizontalLines = (svg, scale) => {
    data.forEach((element, i) => {
        svg.append('g')
            .attr('id', `horizontal-line-${element.dataset}`)
            .append('line')
            .style('stroke', `${colors.dark_gray_text}`)
            .attr('x1', scale(element.estimate - MULTIPLIER * element.se))
            .attr("y1", i * 75 + 75)
            .attr("x2", scale(element.estimate + MULTIPLIER * element.se))
            .attr("y2", i * 75 + 75);
    })
}

/**
 * Creates circles for the horizontal lines.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createCircles = (svg, scale) => {
    data.forEach((element, i) => {
        svg.append('g')
            .attr('id', `cirlce-${element.dataset}`)
            .append('circle')
            .attr('cx', scale(element.estimate))
            .attr('cy', i * 75 + 75)
            .attr('r', 10)
            .attr('stroke', 'black')
            .attr('fill', `${colors.teal}`);
    })
}

/**
 * creates the rhombus for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createPolygon = (svg, scale) => {
    const lineFunction = d3.line()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })

    svg.append('path')
        .attr('d', lineFunction(poly))
        .attr('stroke', 'black')
        .attr('fill', `${colors.teal}`);
}

/**
 * creates the forest plot.
 */
const createForestPlot = (margin, height, width) => {
    // creating the svg canvas.
    const svg = createSvgCanvas({ id: 'forestplot', width: width, height: height })
    // scale for x-axis.
    const xScale = createXScale();
    // creating x axis.
    createXAxis(svg);
    // create vertical line at 0 on x-axis.
    createVerticalLine(svg, xScale);
    // create horizontal lines for the plot.
    createHorizontalLines(svg, xScale);
    // create the circles for the plot.
    createCircles(svg, xScale);
    // create polygon/rhombus.
    createPolygon(svg, xScale);
}

/**
 * @returns {component} - returns the forest plot component. 
 */
const ForestPlot = (props) => {
    useEffect(() => {
        createForestPlot(margin, height, width);
    }, [])

    return (
        <div id="forestplot" />
    )
}

export default ForestPlot;
