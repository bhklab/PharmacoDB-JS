import { select } from 'd3';

const createToolTip = (id) => {
    select(`#${id}`)
        .append('div')
        .attr('id', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('border', 'solid')
        .style('border-width', '1px')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('font-size', '14px')
        .attr('top', 10)
        .attr('left', 10);
};

export default createToolTip;
