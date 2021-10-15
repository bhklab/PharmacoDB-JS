import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../../styles/utils';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import Layout from '../../UtilComponents/Layout';
import { getCellLinesQuery } from '../../../queries/cell';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import TissueCellsPieChart from '../Tissues/TissueCellsPieChart';
import convertToTitleCase from '../../../utils/convertToTitleCase';

const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: (row) => (<Link to={`/cell_lines/${row.row.original.cell_uid}`}>{row.value}</Link>),
  },
  {
    Header: 'Tissue',
    accessor: 'tissue',
    Cell: (row) => (<Link to={`/tissues/${row.row.original.tissue_id}`}>{row.value}</Link>)
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
      const { name, tissue, id, cell_uid } = value;
      return {
        id,
        cell_uid,
        name: name.replace(/_/g, ' '),
        tissue: convertToTitleCase(tissue.name),
        tissue_id: tissue.id
      };
    });
  }
  return tableData;
};

/**
 * Function to render the cell lines page component depending on 
 * the API request outcome.
 * @param {*} loading 
 * @param {*} error 
 * @param {*} pieData 
 * @param {*} tableData 
 * @returns a component to be rendered.
 */
const renderComponent = (loading, error, pieData, tableData) => {
  if(error){
    return(<Error />);
  }

  if(loading){
    return(<Loading />)
  }
  
  return (
    <React.Fragment>
      <h2>Relative Percentage of Cell lines per Tissue</h2>
      <TissueCellsPieChart cells={pieData} />
      <h2> List of Cell Lines </h2>
      <Table columns={tableColumns} data={tableData} />
    </React.Fragment>
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
  const cell_data = React.useMemo(() => getTableData(data), [data]);
  
  return (
    <Layout page="cells">
      <StyledWrapper>
        { 
          renderComponent(loading, error, data, cell_data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default CellLines;
