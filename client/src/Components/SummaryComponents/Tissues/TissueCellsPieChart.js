import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components";
import PieChart from '../../Plots/PieChart';
import Table from '../../UtilComponents/Table/Table';
import plotColors from '../../../styles/plot_colors';

const StyledTissueCellsPieChart = styled.div`
  width: 100%;
  display: flex;
  .tissue-pie-chart {
    width: 85%;
  }
  .tissue-cells-list-container {
    width: 15%;
    min-width: 250px;
    margin-top: 100px;
    margin-left: 10px;
    .tissue-cells-list {
      
    }
  }
  @media only screen and (max-width: 765px) {
    flex-direction: column;
    .tissue-pie-chart {
      width: 100%;
    }
    .tissue-cells-list-container {
      width: 100%;
      margin-top: 50px;
      margin-left: 0px;
    }
  }
`;

const cellTableColumns = [
    {
        Header: 'Name',
        accessor: 'name',
        center: true,
        Cell: (row) => (<Link to={`/cell_lines/${row.row.original.uid}`}>{row.value}</Link>),
    },
];

/**
 *
 * @param {Array} data - cell line data from the cell lines API.
 * @returns {Object} - returns an object of multiple objects,
 * where each object is represented as follows -
 * tissue_name: {
 *  cells: {Array},
 *  total: Number
 * }
 *
 */
const cellLinesGroupedByTissue = (data) => {
    const tissues = [];
    const returnData = {};
    if (data) { 
        data.cell_lines.forEach((cell) => {
        const { name, cell_uid, tissue } = cell;
        if (tissues.includes(tissue.name)) {
            returnData[tissue.name].cells.push({name: name, uid: cell_uid});
            returnData[tissue.name].total += 1;
        } else {
            tissues.push(tissue.name);
            returnData[tissue.name] = {
            cells: [{name: name, tissue_id: tissue.id, uid: cell_uid}],
            total: 1,
            id: tissue.id
            };
        }
        });
    }
    return returnData;
};

const pieChartDataObject = (data) => {
    const returnData = [{
            values: [],
            labels: [],
            hoverinfo: 'label+percent',
            hole: 0.55,
            type: 'pie',
            marker: {
            colors: plotColors.tissues
        },
    }];
    Object.keys(data).forEach((key) => {
        returnData[0].values.push(data[key].total);
        returnData[0].labels.push(key);
        });
    return returnData;
};

const TissueCellsPieChart = (props) => {
    const { cells } = props;
    const [selectedTissueCells, setSelectedTissueCells] = useState(undefined);
    const [chartData, setChartData] = useState({
        pie: [],
        tissues: {}
    });

    useEffect(() => {
        const groupedData = cellLinesGroupedByTissue(cells);
        const pieData = pieChartDataObject(groupedData);
        setChartData({
            pie: pieData,
            tissues: groupedData
        });
    }, [cells]);
    
    const onPieChartClick = (e) => {
        const tissueObj = chartData.tissues[e.points[0].label];
        setSelectedTissueCells({
            tissue: e.points[0].label,
            ...tissueObj
        });
    };
    
    return(
        <StyledTissueCellsPieChart>
            <PieChart className='tissue-pie-chart' data={chartData.pie} onClick={onPieChartClick} />
            <div className='tissue-cells-list-container'>
                <h4>
                {
                    selectedTissueCells ? 
                    `${selectedTissueCells.cells.length} ` : ''}Cell Lines of {selectedTissueCells ? 
                        <a href={`/tissues/${selectedTissueCells.id}`}>{selectedTissueCells.tissue}</a> 
                        : 
                        'a Selected Tissue'
                }
                </h4>
                <div className='tissue-cells-list'>
                {
                    selectedTissueCells ?
                    <Table columns={cellTableColumns} data={selectedTissueCells.cells} showHeader={false} showPageNumSelect={false} />
                    :
                    <p>Click on the pie chart to view the list of cell lines that belong to the seleted tissue.</p>
                }
                </div>
            </div>
        </StyledTissueCellsPieChart>
    );
}

export default TissueCellsPieChart;