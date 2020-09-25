import React, { useEffect } from 'react';
import * as d3 from 'd3';

// margin for the svg element.
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}

// width and height of the SVG canvas.
const width = 600 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

/**
 * creates an svg canvas for the plot.
 */
const createSvg = () => {
    d3.select('#upsetplot')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 
          'translate(' + margin.left + ',' + margin.top + ')');
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
    })
    return (
        <div id='upsetplot'/>
    )
}

export default UpsetPlot;
