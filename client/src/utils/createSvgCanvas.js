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
 * @param {Object} svgParam - object with height, width, margin and id.
 * @param {number} svgParam.height - canvas height with a default value passed as variable.
 * @param {number} svgParam.width - canvas width with a default value passed as variable.
 * @param {Object} svgParam.margin - margin object having the margin values with a default value passed as an object.
 * @param {string} svgParam.id - selecting the id to attach the svg with a default value of an empty string.
 * @returns - an svg canvas with the given height and width.
 */
const createSvgCanvas = (
    { height = defaultHeight, width = defaultWidth, margin = defaultMargin, id = '' }
) => {
    return (
        select(`#${id}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')')

    );
}

export default createSvgCanvas;
