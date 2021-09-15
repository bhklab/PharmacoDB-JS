import React, { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import createSvgCanvas from '../../utils/createSvgCanvas';
import colors from '../../styles/colors';
import styled from 'styled-components';
import Loading from '../UtilComponents/Loading';

// circle radius.
const CIRCLE_RADIUS = 8;

// canvas id.
const CANVAS_ID = 'upsetplot-canvas';
const TABLE_CANVAS_ID = 'table-canvas';
// styling the upset plot.
const UpsetPlotStyle = styled.div`
    width: 800px;
    overflow: auto;
    margin-bottom: 50px;
    text-align: center;
`;

// margin for the svg element.
const margin = {
    top: 80,
    right: 20,
    bottom: 80,
    left: 30
};

/**
 * scale for y-axis
 * @param {number} min - usually begins with zero.
 * @param {number} max - max value along the y axis.
 * @param {number} height - height of svg canvas.
 */
const yScale = (min = 0, max, height) => d3.scaleLinear()
    .domain([min, max])
    .range([height / 1.5, 0])
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
 * @param {number} height - height of svg canvas.
 */
const xAxis = (svg, scale, height) => svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${margin.left * 1.5}, ${height / 1.5})`)
    .call(d3.axisBottom(scale).tickSize(0).tickValues(0));


const appendTextYAxis = (svg, height, type) => svg
    .append('g')
    .attr('id', 'y-axis-text')
    .attr('transform', `rotate(-90)`)
    .append('text')
    .attr('x', -200)
    .attr('y', 0)
    .attr('stroke', `${colors.dark_teal_heading}`)
    .style("font-size", 13)
    .style("position", "sticky")
    .text("Number of " + `${type}`);

/**
 * append the rectangles to the bar chart (bars)
 * @param {Object} svg - svg canvas object.
 * @param {data} Object - data input object.
 * @param {scale} Object - y axis scale.
 * @param {number} height - height of svg canvas.
 */
const appendRectangles = (svg, data, scale, height) => {
    // get the data object keys.
    const keys = Object.keys(data);
    // for each key append rectangle and text.
    const rectangles = svg.append('g')
        .attr('class', 'bar-rectangles');

    keys.forEach((key, i) => {
        rectangles.append('rect')
            .attr('height', height / 1.5 - scale(data[key].count))
            .attr('width', CIRCLE_RADIUS * 2)
            .attr('x', `${(margin.left * 1.8) + (i * CIRCLE_RADIUS * 3)}`)
            .attr('y', scale(data[key].count))
            .attr('id', `rect-${key}`)
            .attr('fill', `${colors.dark_teal_heading}`)
            .on('mouseover', function () {
                // append the corresponding text to the bar chart.
                rectangles.append('text')
                    .attr('x', `${(margin.left * 1.8) + (i * CIRCLE_RADIUS * 3)}`)
                    .attr('y', scale(data[key].count) - 5)
                    .attr('id', `text-${key}`)
                    .text(`${data[key].count}`)
                    .attr('font-size', 9)
                    .attr('font-weight', 600);
                // changes the color.
                d3.select(`#rect-${key}`)
                    .attr('opacity', 0.7);
                // change the cursor type.
                d3.select(this).style("cursor", "pointer");
            })
            .on('mouseout', function () {
                // remove the text from the bar graph.
                d3.select(`#text-${key}`).remove();
                // fill the color again to default.
                d3.select(`#rect-${key}`)
                    .attr('opacity', 1.0);
                // change the cursor to default.
                d3.select(this).style("cursor", "default");
            })
            .on('click', function () {
                makeTable(svg, data[key].values, 'upsetplot', );
            });
    })
};

/**
 *
 * @param {Object} svg - svg canvas object.
 * @param {Array} datasets - array of the datasets.
 * @param {number} height - height of svg canvas.
 */
const circleAxis = (svg, datasets, height) => {
    const circleText = svg.append('g')
        .attr('class', 'circle-axis');

    for (let i = 0; i < datasets.length; i++) {
        circleText.append('text')
            .attr('text-anchor', 'end')
            .attr('transform', `translate(${margin.left * 1.5}, ${height / 1.5 + ((i + 1) * CIRCLE_RADIUS * 3.1)})`)
            .attr('id', `text-circle-${datasets[i]}`)
            .attr('font-size', 12)
            .text(`${datasets[i]}`);
    }
};

/**
 * create table for list of types
 */
function makeTable(svg, names, tableId) {
    // width and height of the SVG canvas.
    // const tableWidth = 400;
    // const tableHeight = 100;
    // d3.selectAll(`#${TABLE_CANVAS_ID}`).remove();
    // const tableSvg = createSvgCanvas({ tableHeight, tableWidth, margin, id: 'upsetplot', canvasId: TABLE_CANVAS_ID });
    //
    // const keys = Object.keys(names);
    // names.forEach((x,i) => {
    //     tableSvg.append('rect')
    //         .attr('x', i * 15)
    //         .attr('y', tableHeight/2)
    //         .text(x.name)
    // })
    // tableSvg.append('circle')
    //     .attr('cx', 200)
    //     .attr('cy', tableHeight/2)
    //     .attr('r', 50)
    //     .attr('stroke', 'black')
    //     .attr('fill', '#69a3b2')
    //     .style('position', 'fixed')
    //     .attr('opacity', 0.3);
    // console.log("List:" ,names);
    //
    // // prepare data: divide data into data.len / 3 rows table and each row has 3 columns
    // const tableData = [];
    // const addElems = names.length % 3;
    // const names_copy = names.slice(0);
    // for (let i = 0; i < 3-addElems; i++) {
    //     names_copy.push(" ");
    // }
    // //make multidimensional array of 3
    // for (let i = 0; i < names.length; i += 3) {
    //     const temp = []
    //     for (let j = 0; j < 3; j++) {
    //         temp.push({"name": names_copy[i+j]})
    //     }
    //     tableData.push(temp)
    // }

    //
    // const table = d3.select("#"+tableId).append('table')
    //     .attr("id", tableId)
    //     .style("border", "1px solid silver")
    //     .style("opacity", "0");
    // //
    // var tbody = table.append("tbody");
    // //
    // //create table rows
    // var tr = tbody.selectAll("tr")
    //     .data(tableData)
    //     .enter()
    //     .append("tr")
    //     .style("border", "1px solid silver");
    //
    // // create table cells
    // var td = tr.selectAll("td")
    //     .data(function(d) {return d;})
    //     .enter()
    //     .append("td")
    //     .style("font-size", "15px")
    //     .style("border", "1px solid silver")
    //     .attr("width", 250)
    //     .style("padding-top", "5px")
    //     .html(function(d,i){
    //         return "<a href=\"" + "/search?q=" + d.name + "\">" + d.name.replaceAll("_", " ") + "</a>"
    //     });

}

/**
 * creates the heatmap circles for the upset plot.
 * @param {Object} svg - svg canavas object.
 * @param {Object} data - input data object.
 * @param {Array} datasets - datasets array.
 * @param {number} length - length of the data.
 * @param {number} height - height of svg canvas.
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
                .attr('transform', `translate(${margin.left * 2}, ${height / 1.5 + CIRCLE_RADIUS * 3})`)
                .style('fill', set.keys.includes(datasets[j]) ? `${colors.dark_teal_heading}` : `${colors.silver}`)
                .attr('r', CIRCLE_RADIUS)
                .attr('cx', i * CIRCLE_RADIUS * 3)
                .attr('cy', j * CIRCLE_RADIUS * 3)
                .attr('class', `circle-set-${i}`)
                .on('mouseover', function () {
                    // change the cursor type.
                    d3.select(this).style("cursor", "pointer")
                })
                .on('mouseout', function () {
                    // change the cursor to default.
                    d3.select(this).style("cursor", "default");
                })
                .on('click', function () {
                    makeTable(svg, data[dataKeys[i]].values, 'upsetplot', );
                });
        }

        // append line to the upset circles.
        circles.append('line')
            .attr('transform', `translate(${margin.left * 2}, ${height / 1.5 + CIRCLE_RADIUS * 3})`)
            .attr('x1', i * CIRCLE_RADIUS * 3)
            .attr('y1', datasets.indexOf(set.keys[0]) * CIRCLE_RADIUS * 3)
            .attr('x2', i * CIRCLE_RADIUS * 3)
            .attr('y2', datasets.indexOf(set.keys[set.keys.length - 1]) * CIRCLE_RADIUS * 3)
            .style('stroke', `${colors.dark_teal_heading}`)
            .attr('stroke-width', 3)
            .attr('class', `line-set-${i}`)
            .on('mouseover', function () {
            // change the cursor type.
            d3.select(this).style("cursor", "pointer");
            })
            .on('mouseout', function () {
                // change the cursor to default.
                d3.select(this).style("cursor", "default");
            })
            .on('click', function () {
                makeTable(svg, data[dataKeys[i]].values, "upsetplot");
            });
    }
};

/**
 * Main function to create upset plot.
 * @param {Object} data - input data object.
 * @param {Array} datasets - array of datasets.
 */
const createUpsetPlot = (data, datasets, type) => {
    // width and height of the SVG canvas.
    const width = CIRCLE_RADIUS * 3.1 * (Object.keys(data).length + 1);
    const height = 700 - margin.top - margin.bottom;

    const tableHeight = 400;
    const tableWidth = 800;
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
    const svg = createSvgCanvas({ height, width, margin, id: 'upsetplot', canvasId: CANVAS_ID });

    // create scale for x axis.
    const scaleXAxis = xScale(0, sortedDataLength, width);
    // create scale for y axis.
    const scaleYAxis = yScale(0, maxCount, height);

    // create x axis.
    xAxis(svg, scaleXAxis, height);
    // create y axis.
    yAxis(svg, scaleYAxis);

    // append text to the y axis.
    appendTextYAxis(svg, height, type);

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
const UpsetPlot = ({ data, datasets, type}) => {
    useEffect(() => {
        // remove the alrady existing upset plot.
        d3.select(`#${CANVAS_ID}`).remove();
        // create upset plot.
        createUpsetPlot(data, datasets, type);
    })
    return (
        <UpsetPlotStyle>
            {data && datasets ? <div id='upsetplot' /> : <Loading />}
        </UpsetPlotStyle>
    )
};

// Proptypes.
UpsetPlot.propTypes = {
    data: PropTypes.object.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    type: PropTypes.string.isRequired,
};

export default UpsetPlot;
