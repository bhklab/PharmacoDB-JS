import React, { useEffect } from 'react';
import * as d3 from 'd3';
import createSvgCanvas from '../../utils/createSvgCanvas';

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
 * creates the heatmap circles for the upset plot.
 */
const upsetCircle = (svg) => {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
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
        const svg = createSvgCanvas({ height, width, margin, id: 'upsetplot' })
        // upset circle.
        upsetCircle(svg)
    })
    return (
        <div id='upsetplot' />
    )
}

// Proptypes.
UpsetPlot.propTypes = {

};

export default UpsetPlot;
