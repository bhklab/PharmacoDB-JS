import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../../utils/createSvgCanvas';
import colors from '../../../styles/colors';

// bar rectangle width.
const BAR_WIDTH = 20;

// circle radius.
const CIRCLE_RADIUS = 10;

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 40
}

// width and height of the SVG canvas.
const width = 1100 - margin.left - margin.right;
const height = 750 - margin.top - margin.bottom;

/**
 * scale for y-axis
 * @param {number} min - usually begins with zero.
 * @param {number} max - max value along the y axis.
 */
const yScale = (min = 0, max) => d3.scaleLinear()
    .domain([min, max])
    .range([height / 2, 0])
    .nice();

/**
 * creates a scale for x-axis.
 * @param {number} min - min value, usually zero.
 * @param {number} max - data length.
 */
const xScale = (min = 0, max) => d3.scaleLinear()
    .domain([min, max])
    .range([0, max * (BAR_WIDTH * 1.75)])
    .nice();

/**
 * y axis of the bar chart.
 * @param {Object} svg - svg canvas object.
 * @param {Object} scale - scale for creating the y axis.
 */
const yAxis = (svg, scale) => svg
    .append('g')
    .attr('transform', `translate(${margin.left * 1.5}, 0)`)
    .call(d3.axisLeft(scale));

/**
 * Creates x axis.
 * @param {Object} svg - svg canvas object.
 * @param {Object} scale - scale for creating the x axis.
 */
const xAxis = (svg, scale) => svg
    .append('g')
    .attr('transform', `translate(${margin.left * 1.5}, ${height / 2})`)
    .call(d3.axisBottom(scale).tickSize(0).tickValues(0));

/**
 * append the rectangles to the bar chart (bars)
 * @param {Object} svg - svg canvas object.
 * @param {data} Object - data input object.
 * @param {scale} Object - y axis scale.
 */
const appendRectangles = (svg, data, scale) => {
    // get the data object keys.
    const keys = Object.keys(data);
    // for each key append rectangle and text.
    keys.forEach((key, i) => {
        svg.append('rect')
            .attr('height', height / 2 - scale(data[key].count))
            .attr('width', BAR_WIDTH)
            .attr('x', `${(margin.left * 1.5) + (i * (BAR_WIDTH + 10) + 10)}`)
            .attr('y', scale(data[key].count))
            .attr('fill', `${colors.dark_teal_heading}`)
            .on('mouseover', (e) => console.log(e))

        svg.append('text')
            .attr('x', `${(margin.left * 1.5) + (i * (BAR_WIDTH + 10) + ((2 * BAR_WIDTH) / 3))}`)
            .attr('y', scale(data[key].count) - 5)
            .text(`${data[key].count}`)
    })
};

/**
 * 
 * @param {Object} svg - svg canvas object.
 * @param {Array} datasets - array of the datasets.
 */
const circleAxis = (svg, datasets) => {
    for (let i = 0; i < datasets.length; i++) {
        svg.append('text')
            .attr("text-anchor", "end")
            .attr('transform', `translate(${margin.left * 1.5}, ${height / 2 + ((i + 1) * 31)})`)
            .text(`${datasets[i]}`);
    }
};

/**
 * creates the heatmap circles for the upset plot.
 * @param {Object} svg - svg canavas object.
 * @param {Object} data - input data object.
 * @param {Array} datasets - datasets array.
 * @param {number} length - length of the data.
 */
const upsetCircle = (svg, data, datasets, length) => {
    // data keys.
    const dataKeys = Object.keys(data);

    // loop and set the circles.
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < datasets.length; j++) {
            svg.append('circle')
                .attr('transform', `translate(${margin.left * 1.9}, ${height / 2 + 30})`)
                .style('fill', data[dataKeys[i]].keys.includes(datasets[j]) ? `${colors.dark_teal_heading}` : `${colors.silver}`)
                .attr("r", CIRCLE_RADIUS)
                .attr("cx", i * (BAR_WIDTH + 10) + BAR_WIDTH / 4)
                .attr("cy", j * 30);
        }

        svg.append('line')
            .attr('transform', `translate(${margin.left * 1.9}, ${height / 2 + 30})`)
            .attr('x1', i * (BAR_WIDTH + 10) + BAR_WIDTH / 4)
            .attr('y1', datasets.indexOf(data[dataKeys[i]].keys[0]) * 30)
            .attr('x2', i * (BAR_WIDTH + 10) + BAR_WIDTH / 4)
            .attr('y2', datasets.indexOf(data[dataKeys[i]].keys[data[dataKeys[i]].keys.length - 1]) * 30)
            .style('stroke', `${colors.dark_teal_heading}`)
            .attr('stroke-width', 4);
    }
};

/**
 * Main function to create upset plot.
 * @param {Object} data - input data object.
 * @param {Array} datasets - array of datasets.
 */
const createUpsetPlot = (data, datasets) => {
    // get the max total value in the data object.
    const maxCount = Math.max(...Object.keys(data).map(el => data[el].count));
    // get the length of the data object.
    const dataLength = Object.keys(data).length;
    // svg canvas.
    const svg = createSvgCanvas({ height, width, margin, id: 'upsetplot' })
    // create scale for x axis.
    const scaleXAxis = xScale(0, dataLength);
    // create scale for y axis.
    const scaleYAxis = yScale(0, maxCount);
    // create x axis.
    xAxis(svg, scaleXAxis);
    // create y axis.
    yAxis(svg, scaleYAxis);
    // append rectangle for the bar chart.
    appendRectangles(svg, data, scaleYAxis);
    // upset circle.
    upsetCircle(svg, data, datasets, dataLength);
    // append text to the circles as axis.
    circleAxis(svg, datasets);
};

/**
 * returns (
 *  <UpsetPlot/>
 * )
 */
const UpsetPlot = ({ data, datasets }) => {
    useEffect(() => {
        // create upset plot.
        createUpsetPlot(data, datasets);
    })
    return (
        <div id='upsetplot' />
    )
};

// Proptypes.
UpsetPlot.propTypes = {
    data: PropTypes.object.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UpsetPlot;
