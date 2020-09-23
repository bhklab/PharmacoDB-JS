import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../../styles/utils';
import Table from '../../Utils/Table';
import Layout from '../../Utils/Layout';
import PieChart from '../../Plots/PieChart';
import { getCellLinesQuery } from '../../../queries/cell';
import Loading from '../../Utils/Loading';
import TitleCase from '../../Utils/TitleCase';

const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Tissue',
    accessor: 'tissue',
  },
];

/**
 *
 * @param {Array} data - tissue data from the tissues API.
 */
const getTableData = (data) => {
  let tableData = [];
  if (data) {
    tableData = data.cell_lines.map((value) => {
      const { name, tissue } = value;
      return {
        name: name.replace(/_/g, ' '),
        tissue: TitleCase(tissue.name.replace(/_/g, ' ')),
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
        '#CAD2C5', '#84a98c', '#52796F', '#354F52', '#2F3E46', '#284B63',
        '#2F4858', '#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#6F523B',
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
const renderComponent = (loading, error, columns, data, pieData) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h2> Relative Percentage of Cell lines per Tissue in PharmacoDB </h2>
      <PieChart data={pieData} />
      <h2> List of Cell Lines </h2>
      {/* <Table columns={columns} data={data} /> */}
    </>
  );
};

/**
 * Parent component for the tissues page.
 *
 * @component
 * @example
 *
 * @returns ( <Cells/> )
*/
const CellLines = () => {
  // queries to get the cell line data.
  const { loading, error, data } = useQuery(getCellLinesQuery);
  // setting data for the table.
  const columns = React.useMemo(() => tableColumns, []);
  const cell_data = React.useMemo(() => getTableData(data), [data]);
  // data for pie chart.
  const groupedData = cellLinesGroupedByTissue(data);
  const pieData = pieChartDataObject(groupedData);
  return (
    <Layout page="cells">
      <StyledWrapper>
        {
          renderComponent(loading, error, columns, cell_data, pieData)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default CellLines;
