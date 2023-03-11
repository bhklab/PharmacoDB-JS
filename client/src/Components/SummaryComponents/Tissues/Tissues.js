import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import StyledWrapper from '../../../styles/utils';
import Table from '../../UtilComponents/Table/Table';
import Layout from '../../UtilComponents/Layout';
import { getTissuesQuery } from '../../../queries/tissue';
import { getCellLinesQuery } from '../../../queries/cell';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import TissueCellsPieChart from './TissueCellsPieChart';

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
 * Function to render the cell lines page component depending on 
 * the API request outcome.
 * @param {boolean} loading 
 * @param {object} error 
 * @param {Array} pieData 
 * @param {Array} tableData 
 * @returns a component to be rendered.
 */
const renderComponent = (loading, error, pieData, tableData) => {
  if(error){ 
    return(<Error />);
  }

  if(loading) {
    return(<Loading />)
  }

  return (
    <React.Fragment>
      <h2>Relative Percentage of Cell lines per Tissue</h2>
      <TissueCellsPieChart cells={pieData} />
      <h2> List of Tissues </h2>
      <Table columns={tableColumns} data={tableData} center={true} />
    </React.Fragment>
  );
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
  // queries to get the cell line and tissue data.
  const { loading: tissueQueryLoading, error: tissuesQueryError, data: tissues } = useQuery(getTissuesQuery);
  const { loading: cellLineQueryLoading, error: cellLineQueryError, data: cells } = useQuery(getCellLinesQuery);
  // setting data for the table.
  const data = React.useMemo(() => getTableData(tissues), [tissues]);

  return (
    <Layout page="tissues">
      <StyledWrapper>
        {
          renderComponent(
            (tissueQueryLoading || cellLineQueryLoading), 
            (cellLineQueryError || tissuesQueryError), 
            cells, 
            data
          )
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Tissues;
