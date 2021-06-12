import { select } from 'd3';

// default margin.
const defaultMargin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
}

// default width and height of the SVG canvas.
const defaultWidth = 600 - defaultMargin.left - defaultMargin.right;
const defaultHeight = 600 - defaultMargin.top - defaultMargin.bottom;


/**
 * @param {number} height - canvas height.
 * @param {number} width - canvas width
 * @param {Object} margin - margin object having the margin values.
 * @param {string} id - selecting the id to attach the svg.
 */
const createSvgCanvas = (
    height = defaultHeight, width = defaultWidth, margin = defaultMargin, id
) => (
        select(`#${id}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')')

    );

export default createSvgCanvas;
