import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../utils/createSvgCanvas';
import colors from '../../styles/colors';

// data length and multiplier variables.
const ADDITIONAL = 2;

// margin for the svg element.
const margin = {
    top: 40,
    right: 20,
    bottom: 50,
    left: 20,
};

// width and height of the SVG canvas.
const width = 900 - margin.left - margin.right;
const height = 450 - margin.top - margin.bottom;

const getAllDataTypes = (data) => {
    // variable to store the different data types.
    const dataTypes = [];
    // looping through and storing the data type if it's not already present.
    data.forEach(el => {
        if (!dataTypes.includes(el.mDataType)) {
            dataTypes.push(el.mDataType);
        }
    });
    return dataTypes;
};

/**
 * 
 * @param {Array} data - input data.
 */
const calculateMinMax = (data) => {
    // calculates the minimum and maximum estimate from the data.
    const minEstimate = Math.min(...data.map((val) => val.estimate));
    const maxEstimate = Math.max(...data.map((val) => val.estimate));

    // calculates the minimum and maximum analytic from the data.
    const minAnalytic = Math.min(...data.map((val) => val.lower_analytic));
    const maxAnalytic = Math.max(...data.map((val) => val.upper_analytic));

    // calculates the minimum and maximum permutation from the data.
    const minPermutation = Math.min(...data.map((val) => val.lower_permutation));
    const maxPermutation = Math.max(...data.map((val) => val.upper_permutation));

    // assign min and max.
    const min = minPermutation || minAnalytic;
    const max = maxPermutation || maxAnalytic;

    return {
        min,
        max
    }
};

/**
 * @returns - d3 linear scale for circles.
 * mapped the min and max values to a range.
 */
const circleScaling = () => d3.scaleLinear().domain([0, 150]).range([5, 25]);

/**
 * 
 * @param {number} min - min value to be passed to the domain.
 * @param {number} max - max value to be passed to the domain.
 * @returns - d3 linear scale for x-axis.
 */
const createXScale = (min, max) =>
    d3.scaleLinear()
        .domain([min, max])
        .range([100, (width * 0.65)])
        .nice();

/**
 * Appends x-axis to the main svg element.
 * @param {Object} svg - svg selection.
 */
const createXAxis = (svg, scale) => {
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(scale));

    // append x-axis label.
    svg.append('g')
        .attr('id', 'x-axis-label')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', (width * 0.65) / 2)
        .attr('y', height + 40)
        .attr('fill', `${colors.dark_teal_heading}`)
        .text('Pearson correlation coefficient')
        .attr('font-size', '12px');

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
        .attr('y1', 0)
        .attr('x2', scale(0))
        .attr('y2', height);
};

/**
 * Creates horizontal lines for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
const createHorizontalLines = (svg, scale, data) => {
    const horizontal = svg.append('g')
        .attr('id', `horizontal-lines`)

    data.forEach((element, i) => {
        horizontal
            .append('line')
            .attr('id', `horizontal-line-${element.dataset.name}`)
            .style('stroke', `${colors.dark_gray_text}`)
            .style('stroke-width', 1.25)
            .attr('x1', scale(element.lower_permutation || element.lower_analytic))
            .attr('y1', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('x2', scale(element.upper_permutation || element.upper_analytic))
            .attr('y2', ((i + 1) * height) / (data.length + ADDITIONAL))
    });
};

/**
 * Creates circles for the horizontal lines.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} xScale - x axis scale.
 * @param {Object} circleScale - scale to set the radius of the circle.
 * @param {Array} data - data array.
 */
const createCircles = (svg, xScale, circleScale, data, colorScale) => {
    const circles = svg.append('g')
        .attr('id', 'cirlces');

    data.forEach((element, i) => {
        circles
            .append('circle')
            .attr('id', `cirlce-${element.dataset.name}`)
            .attr('cx', xScale(element.estimate))
            .attr('cy', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('r', circleScale(element.n))
            .attr('fill', `${colorScale(element.mDataType)}`);
    });
};

/**
 * creates the rhombus for the forest plot.
 * @param {Object} svg - svg selection for the global canvas.
 * @param {Object} scale - x axis scale.
 */
// const createPolygon = (svg, scale) => {
//     const lineFunction = d3
//         .line()
//         .x(function (d) {
//             return d.x;
//         })
//         .y(function (d) {
//             return d.y;
//         });

//     svg.append('path')
//         .attr('d', lineFunction(poly))
//         .attr('stroke', `${colors.dark_gray_text}`)
//         .attr('fill', `${colors.teal}`);
// };

/**
 * Appends dataset name to the right of the forest plot.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendDatasetName = (svg, data) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'dataset-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', 10)
        .attr('y', -20)
        .attr('fill', `${colors.dark_teal_heading}`)
        .text('Dataset Name')
        .attr('font-size', '18px');

    const dataset = svg.append('g')
        .attr('id', 'dataset-names');

    // append dataset name.
    data.forEach((element, i) => {
        dataset
            .append('text')
            .attr('id', `dataset-${element.dataset.name}`)
            .attr('font-weight', 200)
            .attr('x', 10)
            .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('fill', `${colors.dark_teal_heading}`)
            .text(`${element.dataset.name}`)
            .attr('font-size', '14px');
    });
};

/**
 * Appends estimate text to the chart.
 * @param {Object} svg
 * @param {Array} data - data array.
 */
const appendEstimateText = (svg, data) => {
    // append header (dataset)
    svg.append('g')
        .attr('id', 'estimate-header')
        .append('text')
        .attr('font-weight', 700)
        .attr('x', (width * 0.65) + 10)
        .attr('y', -20)
        .attr('fill', `${colors.dark_teal_heading}`)
        .text('Estimate')
        .attr('font-size', '18px');

    const estimate = svg.append('g')
        .attr('id', 'estimate');

    // append dataset name.
    data.forEach((element, i) => {
        estimate
            .append('text')
            .attr('id', `estimate-${element.dataset.name}`)
            .attr('font-weight', 200)
            .attr('x', (width * 0.65) + 10)
            .attr('y', ((i + 1) * height) / (data.length + ADDITIONAL))
            .attr('fill', `${colors.dark_teal_heading}`)
            .text(`(
                ${(element.lower_permutation || element.lower_analytic).toFixed(2)}, 
                ${(element.upper_permutation || element.upper_analytic).toFixed(2)}
            )`)
            .attr('font-size', '14px');
    });
};

const createLegend = (svg, data, mDataTypes, scale) => {
    // append legends.
    const legends = svg.append('g')
        .attr('id', 'legends');

    mDataTypes.forEach((dataType, i) => {
        legends.append('rect')
            .attr('x', width - 160)
            .attr('y', ((height * 0.2) + ((i + 1) * 20)))
            .attr('width', 20)
            .attr('height', 20)
            .attr('stroke', 'black')
            .attr('fill', `${scale(dataType)}`);
    });

    // append legend text.
    const legendText = svg.append('g')
        .attr('id', 'legend-text');

    mDataTypes.forEach((dataType, i) => {
        legendText
            .append('text')
            .attr('id', `legend-${dataType}`)
            .attr('x', width - 135)
            .attr('y', ((height * 0.2) + ((i + 1) * 25)))
            .text(`${dataType}`)
            .attr('font-size', '12px');
    });
};

/**
 * Main function to create the forest plot.
 * @param {Object} margin - margin for the svg canavas.
 * @param {number} height - height of the svg canvas.
 * @param {number} width - width of the svg canvas.
 * @param {Array} data - array of data.
 */
const createForestPlot = (margin, height, width, data) => {
    const mDataTypes = getAllDataTypes(data);
    const linearScale = d3.scaleOrdinal()
        .domain(mDataTypes)
        .range([
            '#b2182b',
            '#ef8a62',
            '#fddbc7',
            '#d1e5f0',
            '#67a9cf',
            '#2166ac',
        ]);
    // creating the svg canvas.
    const svg = createSvgCanvas({ id: 'forestplot', width, height, margin });
    // min and max.
    const { min, max } = calculateMinMax(data);
    // scale for x-axis.
    const xScale = createXScale(min, max);
    // scale for circles.
    const circleScale = circleScaling();
    // creating x axis.
    createXAxis(svg, xScale);
    // create vertical line at 0 on x-axis.
    createVerticalLine(svg, xScale);
    // create horizontal lines for the plot.
    createHorizontalLines(svg, xScale, data);
    // create the circles for the plot.
    createCircles(svg, xScale, circleScale, data, linearScale);
    // create polygon/rhombus.
    // createPolygon(svg, xScale);
    // append the dataset names corresponding to each horizontal line.
    appendDatasetName(svg, data);
    // append estimate as text to the svg.
    appendEstimateText(svg, data);
    // create legend.
    createLegend(svg, data, mDataTypes, linearScale);
};

/**
 * @returns {component} - returns the forest plot component.
 */
const ForestPlot = ({ data }) => {
    useEffect(() => {
        createForestPlot(margin, height, width, data);
    }, []);

    return <div id="forestplot" />;
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
