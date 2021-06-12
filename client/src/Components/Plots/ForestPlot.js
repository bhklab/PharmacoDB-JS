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
 * creates the forest plot.
 */
const createForestPlot = (margin, height, width) => {
    const svg = createSvgCanvas({ id: 'forestplot' })
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
