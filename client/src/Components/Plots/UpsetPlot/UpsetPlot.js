import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../../utils/createSvgCanvas';
import colors from '../../../styles/colors';

// circle radius.
const CIRCLE_RADIUS = 10;

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 60
};

/**
 * scale for y-axis
 * @param {number} min - usually begins with zero.
 * @param {number} max - max value along the y axis.
 * @param {number} height - height of svg canvas.
 */
const yScale = (min = 0, max, height) => d3.scaleLinear()
    .domain([min, max])
    .range([height / 2, 0])
    .nice();

/**
 * creates a scale for x-axis.
 * @param {number} min - min value, usually zero.
 * @param {number} max - data length.
 * @param {number} width - width of the svg canvas.
 */
const xScale = (min = 0, max, width) => d3.scaleLinear()
    .domain([min, max])
    .range([0, width])
    .nice();

/**
 * y axis of the bar chart.
 * @param {Object} svg - svg canvas object.
 * @param {Object} scale - scale for creating the y axis.
 */
const yAxis = (svg, scale) => svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${margin.left * 1.5}, 0)`)
    .call(d3.axisLeft(scale));

/**
 * Creates x axis.
 * @param {Object} svg - svg canvas object.
 * @param {Object} scale - scale for creating the x axis.
 */
const xAxis = (svg, scale, height) => svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${margin.left * 1.5}, ${height / 2})`)
    .call(d3.axisBottom(scale).tickSize(0).tickValues(0));

/**
 * append the rectangles to the bar chart (bars)
 * @param {Object} svg - svg canvas object.
 * @param {data} Object - data input object.
 * @param {scale} Object - y axis scale.
 */
const appendRectangles = (svg, data, scale, height) => {
    // get the data object keys.
    const keys = Object.keys(data);

    // for each key append rectangle and text.
    const rectangles = svg.append('g')
        .attr('class', 'bar-rectangles');

    keys.forEach((key, i) => {
        rectangles.append('rect')
            .attr('height', height / 2 - scale(data[key].count))
            .attr('width', CIRCLE_RADIUS * 2)
            .attr('x', `${(margin.left * 1.8) + (i * CIRCLE_RADIUS * 3)}`)
            .attr('y', scale(data[key].count))
            .attr('id', `rect-${key}`)
            .attr('fill', `${colors.dark_teal_heading}`)
            .on('mouseover', (e) => console.log(e))

        rectangles.append('text')
            .attr('x', `${(margin.left * 1.9) + (i * CIRCLE_RADIUS * 3)}`)
            .attr('y', scale(data[key].count) - 5)
            .attr('id', `text-${key}`)
            .text(`${data[key].count}`)
    })
};

/**
 * 
 * @param {Object} svg - svg canvas object.
 * @param {Array} datasets - array of the datasets.
 */
const circleAxis = (svg, datasets, height) => {
    const circleText = svg.append('g')
        .attr('class', 'circle-axis');

    for (let i = 0; i < datasets.length; i++) {
        circleText.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', `translate(${margin.left * 1.5}, ${height / 2 + ((i + 1) * CIRCLE_RADIUS * 3)})`)
            .attr('id', `text-circle-${datasets[i]}`)
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
const upsetCircle = (svg, data, datasets, length, height) => {
    // data keys.
    const dataKeys = Object.keys(data);

    const circles = svg.append('g')
        .attr('class', 'circles');

    // loop and set the circles.
    for (let i = 0; i < length; i++) {
        // get set.
        const set = data[dataKeys[i]];

        for (let j = 0; j < datasets.length; j++) {
            // append circles.
            circles.append('circle')
                .attr('transform', `translate(${margin.left * 2}, ${height / 2 + CIRCLE_RADIUS * 3})`)
                .style('fill', set.keys.includes(datasets[j]) ? `${colors.dark_teal_heading}` : `${colors.silver}`)
                .attr('r', CIRCLE_RADIUS)
                .attr('cx', i * CIRCLE_RADIUS * 3)
                .attr('cy', j * CIRCLE_RADIUS * 3)
                .attr('class', `circle-set-${i}`);
        }

        // append line to the upset circles.
        circles.append('line')
            .attr('transform', `translate(${margin.left * 2}, ${height / 2 + CIRCLE_RADIUS * 3})`)
            .attr('x1', i * CIRCLE_RADIUS * 3)
            .attr('y1', datasets.indexOf(set.keys[0]) * CIRCLE_RADIUS * 3)
            .attr('x2', i * CIRCLE_RADIUS * 3)
            .attr('y2', datasets.indexOf(set.keys[set.keys.length - 1]) * CIRCLE_RADIUS * 3)
            .style('stroke', `${colors.dark_teal_heading}`)
            .attr('stroke-width', 3)
            .attr('class', `line-set-${i}`);;
    }
};

/**
 * Main function to create upset plot.
 * @param {Object} data - input data object.
 * @param {Array} datasets - array of datasets.
 */
const createUpsetPlot = (data, datasets) => {
    // width and height of the SVG canvas.
    const width = CIRCLE_RADIUS * 5 * datasets.length;
    const height = 750 - margin.top - margin.bottom;

    // sort the data based on the count.
    const sortedEnteries = Object.entries(data).sort((a, b) => b[1].count - a[1].count);
    // sorted data.
    const sortedData = {};
    sortedEnteries.forEach((entry) => {
        sortedData[entry[0]] = entry[1];
    });

    // get the max total value in the sortedData object.
    const maxCount = Math.max(...Object.keys(sortedData).map(el => sortedData[el].count));
    // get the length of the sortedData object.
    const sortedDataLength = Object.keys(sortedData).length;

    // svg canvas.
    const svg = createSvgCanvas({ height, width, margin, id: 'upsetplot' })

    // create scale for x axis.
    const scaleXAxis = xScale(0, sortedDataLength, width);
    // create scale for y axis.
    const scaleYAxis = yScale(0, maxCount, height);

    // create x axis.
    xAxis(svg, scaleXAxis, height);
    // create y axis.
    yAxis(svg, scaleYAxis);

    // append rectangle for the bar chart.
    appendRectangles(svg, sortedData, scaleYAxis, height);

    // upset circle.
    upsetCircle(svg, sortedData, datasets, sortedDataLength, height);
    // append text to the circles as axis.
    circleAxis(svg, datasets, height);
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
