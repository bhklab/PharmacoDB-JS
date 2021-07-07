import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../../utils/createSvgCanvas';

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 20
}

// width and height of the SVG canvas.
const width = 1100 - margin.left - margin.right;
const height = 750 - margin.top - margin.bottom;

// creates a scale for y-axis.
const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, 500])

// creates y-axis.
const yAxis = (svg) => svg
    .append('g')
    .attr('transform', `translate(0, ${height / 2})`)
    .call(d3.axisBottom(yScale))

/**
 * creates the heatmap circles for the upset plot.
 */
const upsetCircle = (svg, data, datasets) => {
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < datasets.length; j++) {
            svg.append('circle')
                .attr('transform', `translate(0, ${height / 2 + 50})`)
                .style('fill', 'silver')
                .attr("r", 10)
                .attr("cx", i * 30)
                .attr("cy", j * 30);
        }
    }
}

/**
 * Main function that will create 
 * @param {Object} svg - svg element.
 * 
 */
const createUpsetPlot = (svg, data, datasets) => {
    // upset circle.
    upsetCircle(svg, data, datasets);
    // create y axis.
    yAxis(svg);
}

/**
 * returns (
 *  <UpsetPlot/>
 * )
 */
const UpsetPlot = ({ data, datasets }) => {
    useEffect(() => {
        // svg canvas.
        const svg = createSvgCanvas({ height, width, margin, id: 'upsetplot' })
        // create upset plot.
        createUpsetPlot(svg, data, datasets);
    })
    return (
        <div id='upsetplot' />
    )
}

// Proptypes.
UpsetPlot.propTypes = {
    data: PropTypes.object.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UpsetPlot;
