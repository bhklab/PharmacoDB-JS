import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../utils/createSvgCanvas';
import colors from '../../styles/colors';

// data length and multiplier variables.
const data_length = data.length + 3;
const MULTIPLIER = 1.96;

// margin for the svg element.
const margin = {
    top: 40,
    right: 20,
    bottom: 20,
    left: 20
};

// width and height of the SVG canvas.
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// calculates the minimum and maximum estimate from the data.
const minEstimate = Math.min(...data.map(val => val.estimate));
const maxEstimate = Math.max(...data.map(val => val.estimate));

// calculates the minimum and maximum standard error from the data.
const minStandardError = Math.min(...data.map(val => val.se));
const maxStandardError = Math.max(...data.map(val => val.se));

// calculates the minimum and maximum n value from the data.
const minNValue = Math.min(...data.map(val => val.n));
const maxNValue = Math.max(...data.map(val => val.n));

/**
 * @returns - d3 linear scale for circles.
 * mapped the min and max values to a range.
 */
const circleScaling = () => (
    d3.scaleLinear()
        .domain([0, 150])
        .range([5, 15])
        .nice()
);

/**
 * @returns - d3 linear scale for x-axis.
 */
const createXScale = () => (
    d3.scaleLinear()
        .domain([minEstimate - MULTIPLIER * maxStandardError, maxEstimate + MULTIPLIER * maxStandardError])
        .range([100, (width * 3) / 4])
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
};

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
            .attr("y1", i * height / data_length + height / data_length)
            .attr("x2", scale(element.estimate + MULTIPLIER * element.se))
            .attr("y2", i * height / data_length + height / data_length);
    })
};

/**
 * Creates circles for the horizontal lines.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} xScale - x axis scale.
 * @param {Object} circleScale - scale to set the radius of the circle.
 */
const createCircles = (svg, xScale, circleScale) => {
    data.forEach((element, i) => {
        svg.append('g')
            .attr('id', `cirlce-${element.dataset}`)
            .append('circle')
            .attr('cx', xScale(element.estimate))
            .attr('cy', i * height / data_length + height / data_length)
            .attr('r', circleScale(element.n))
            .attr('stroke', 'black')
            .attr('fill', `${colors.teal}`);
    })
};

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
};

/**
 * Appends dataset name to the right of the forest plot.
 * @param {Object} svg
 */
const appendDatasetName = (svg) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'dataset-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', 10)
        .attr('y', 10)
        .attr('fill', `${colors.dark_gray_text}`)
        .text('Dataset Name')

    // append dataset name.
    data.forEach((element, i) => {
        svg.append('g')
            .attr('id', `dataset-${element.dataset_name}`)
            .append('text')
            .attr('font-weight', 200)
            .attr('x', 10)
            .attr('y', i * height / data_length + height / data_length)
            .attr('fill', `${colors.dark_gray_text}`)
            .text(`${element.dataset_name}`)
    })
};

/**
 * Appends estimate text to the chart.
 * @param {Object} svg
 */
const appendEstimateText = (svg) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'estimate-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', (width * 3) / 4 + 10)
        .attr('y', 10)
        .attr('fill', `${colors.dark_gray_text}`)
        .text('Estimate')

    // append dataset name.
    data.forEach((element, i) => {
        svg.append('g')
            .attr('id', `dataset-${element.dataset_name}`)
            .append('text')
            .attr('font-weight', 200)
            .attr('x', (width * 3) / 4 + 10)
            .attr('y', i * height / data_length + height / data_length)
            .attr('fill', `${colors.dark_gray_text}`)
            .text(`(
                ${(element.estimate - MULTIPLIER * element.se).toFixed(2)}, 
                ${(element.estimate + MULTIPLIER * element.se).toFixed(2)}
            )`)
    })
};

/**
 * Main function to create the forest plot.
 * @param {Object} margin - margin for the svg canavas.
 * @param {number} height - height of the svg canvas.
 * @param {number} width - width of the svg canvas.
 */
const createForestPlot = (margin, height, width) => {
    // creating the svg canvas.
    const svg = createSvgCanvas({ id: 'forestplot', width, height, margin })
    // scale for x-axis.
    const xScale = createXScale();
    // scale for circles.
    const circleScale = circleScaling();
    // creating x axis.
    createXAxis(svg);
    // create vertical line at 0 on x-axis.
    createVerticalLine(svg, xScale);
    // create horizontal lines for the plot.
    createHorizontalLines(svg, xScale);
    // create the circles for the plot.
    createCircles(svg, xScale, circleScale);
    // create polygon/rhombus.
    createPolygon(svg, xScale);
    // append the dataset names corresponding to each horizontal line.
    appendDatasetName(svg);
    // append estimate as text to the svg.
    appendEstimateText(svg);
};

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
};


// proptypes for the forest plot component.
ForestPlot.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.shape({
        top: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
    }),
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ForestPlot;
