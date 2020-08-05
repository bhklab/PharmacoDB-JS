import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../styles/utils';
import Table from '../Table/Table';
import Layout from '../Utils/Layout';
import PieChart from '../Plots/PieChart';
import { getTissuesQuery } from '../../queries/tissue';

const table_columns = [
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
  console.log(data);
  let table_data = [];
  if (data) {
    table_data = data.tissues.map((value) => {
      const { id, name } = value;
      return {
        id,
        name,
      };
    });
  }
  return table_data;
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
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <p> Loading.... </p>;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h3> Relative Percentage of Cell lines per Tissue in PharmacoDB </h3>
      <PieChart />
      <h2> List of Tissues </h2>
      <Table columns={columns} data={data} />
    </>
  );
};

const Tissues = () => {
  const { loading, error, data: tissue_data } = useQuery(getTissuesQuery);
  const columns = React.useMemo(() => table_columns, []);
  const data = React.useMemo(() => getTableData(tissue_data), [tissue_data]);
  return (
    <Layout>
      <StyledWrapper>
        {
          renderComponent(loading, error, columns, data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Tissues;
