import React, { useEffect } from 'react';
import * as d3 from 'd3';
import BarPlot from './BarPlot'

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}

// width and height of the SVG canvas.
const width = 1100 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

/**
 * creates an svg canvas for the plot.
 */
const createSvg = () => {
    return d3.select('#upsetplot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 
          'translate(' + margin.left + ',' + margin.top + ')');
}

/**
 * creates the heatmap circles for the upset plot.
 */
const upsetCircle = (svg) => {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            svg.append('circle')
            .style('fill', 'silver')
            .attr("r", 10)
            .attr("cx", i * 30)
            .attr("cy", j * 30);
        }
    }
}

/**
 * returns (
 *  <UpsetPlot/>
 * )
 */
const UpsetPlot = () => {
    useEffect(() => {
        // svg canvas.
        const svg = createSvg()
        // upset circle.
        upsetCircle(svg)
    })
    return (
        <div id='upsetplot'/>
    )
}

export default UpsetPlot;
