import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../styles/utils';
import Table from '../Table/Table';
import Layout from '../Utils/Layout';
import PieChart from '../Plots/PieChart';
import { getTissuesQuery } from '../../queries/tissue';
import { getCellLinesQuery } from '../../queries/cell';

const tableColumns = [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'Name',
    accessor: 'name',
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
 *  cells: [Array],
 *  total: Number
 * }
 *
 */
const cellLinesGroupedByTissue = (data) => {
  const tissues = [];
  const returnData = {};
  if (data) {
    data.cell_lines.forEach((cell) => {
      const { name, tissue } = cell;
      if (tissues.includes(tissue.name)) {
        returnData[tissue.name].cells.push(name);
        returnData[tissue.name].total += 1;
      } else {
        tissues.push(tissue.name);
        returnData[tissue.name] = {
          cells: [name],
          total: 1,
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
  const threshold = 50;
  const returnData = [{
    values: [],
    labels: [],
    hoverinfo: 'label+percent',
    hole: 0.55,
    type: 'pie',
    marker: {
      colors: [
        '#67001f', '#b2182b', '#d6604d', '#7f3b08', '#f4a582', '#fddbc7',
        '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061',
      ],
    },
  }];
  Object.keys(data).forEach((key) => {
    if (data[key].total > threshold) {
      returnData[0].values.push(data[key].total);
      returnData[0].labels.push(key);
    }
  });
  return returnData;
};

/**
 *
 * @param {Boolean} loading
 * @param {Boolean} error
 * @param {Array} columns
 * @param {Array} data
 *
 * @returns - (
 *  <PieChart/>
 *  <Table/>
 * )
 */
const renderComponent = (tissueQueryLoading, cellLineQueryLoading, cellLineQueryError, tissuesQueryError, columns, data, pieData) => {
  if (tissueQueryLoading || cellLineQueryLoading) {
    return <p> Loading.... </p>;
  }
  if (cellLineQueryError || tissuesQueryError) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h3> Relative Percentage of Cell lines per Tissue in PharmacoDB </h3>
      <PieChart data={pieData} />
      <h2> List of Tissues </h2>
      <Table columns={columns} data={data} />
    </>
  );
};

const Tissues = () => {
  // queries to get the cell line and tissue data.
  const { loading: tissueQueryLoading, error: tissuesQueryError, data: tissues } = useQuery(getTissuesQuery);
  const { loading: cellLineQueryLoading, error: cellLineQueryError, data: cells } = useQuery(getCellLinesQuery);
  // setting data for the table.
  const columns = React.useMemo(() => tableColumns, []);
  const data = React.useMemo(() => getTableData(tissues), [tissues]);
  // data for pie chart.
  const groupedData = cellLinesGroupedByTissue(cells);
  const pieData = pieChartDataObject(groupedData);
  console.log(pieData);
  return (
    <Layout>
      <StyledWrapper>
        {
          renderComponent(tissueQueryLoading, cellLineQueryLoading, cellLineQueryError, tissuesQueryError, columns, data, pieData)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Tissues;
