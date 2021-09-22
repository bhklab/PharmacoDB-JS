import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import StyledWrapper from '../../../styles/utils';
import Table from '../../UtilComponents/Table/Table';
import Layout from '../../UtilComponents/Layout';
import PieChart from '../../Plots/PieChart';
import plotColors from '../../../styles/plot_colors';
import { getTissuesQuery } from '../../../queries/tissue';
import { getCellLinesQuery } from '../../../queries/cell';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import styled from 'styled-components';

const StyledTissuePieChart = styled.div`
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

const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    center: true,
    rowSpan: 2,
    width: 50,
    Cell: (row) => (<Link to={`/tissues/${row.row.original.id}`}>{row.value}</Link>),
  },
];

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
 * @param {Array} data - tissue data from the tissues API.
 */
const getTableData = (data) => {
  let tableData = [];
  if (data) {
    tableData = data.tissues.map((value) => {
      const { id, name } = value;
      return {
        id,
        name: name.replace(/_/g, ' '),
      };
    });
  }
  return tableData;
};

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

/**
 *
 * @param {Object} data
 */
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

/**
 * Parent component for the tissues page.
 *
 * @component
 * @example
 *
 * @returns ( <Tissues/> )
*/
const Tissues = () => {
  const [selectedTissueCells, setSelectedTissueCells] = useState(undefined);
  // queries to get the cell line and tissue data.
  const { loading: tissueQueryLoading, error: tissuesQueryError, data: tissues } = useQuery(getTissuesQuery);
  const { loading: cellLineQueryLoading, error: cellLineQueryError, data: cells } = useQuery(getCellLinesQuery);
  // setting data for the table.
  const columns = React.useMemo(() => tableColumns, []);
  const data = React.useMemo(() => getTableData(tissues), [tissues]);
  // data for pie chart.
  const groupedData = cellLinesGroupedByTissue(cells);
  const pieData = pieChartDataObject(groupedData);

  const onPieChartClick = (e) => {
    const tissueObj = groupedData[e.points[0].label];
    setSelectedTissueCells({
      tissue: e.points[0].label,
      ...tissueObj
    });
  };

  return (
    <Layout page="tissues">
      <StyledWrapper>
        {
          // renderComponent(tissueQueryLoading, cellLineQueryLoading, cellLineQueryError, tissuesQueryError, columns, data, pieData, groupedData)
          tissueQueryLoading || cellLineQueryLoading ? <Loading />
          :
          cellLineQueryError || tissuesQueryError ? <Error />
          :
          <React.Fragment>
            <h2 className="new-section">Relative Percentage of Cell lines per Tissue</h2>
            <StyledTissuePieChart>
              <PieChart className='tissue-pie-chart' data={pieData} onClick={onPieChartClick} />
              <div className='tissue-cells-list-container'>
                <h4>
                  {selectedTissueCells ? `${selectedTissueCells.cells.length} ` : ''}Cell Lines of {selectedTissueCells ? <a href={`/tissues/${selectedTissueCells.id}`}>{selectedTissueCells.tissue}</a> : 'a Selected Tissue'}
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
            </StyledTissuePieChart>
            <h2 className="new-section"> List of Tissues </h2>
            <Table columns={columns} data={data} center={true} />
          </React.Fragment>
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Tissues;
