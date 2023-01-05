import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../../UtilComponents/Table/Table';
import { Link } from 'react-router-dom';
import Layout from '../../UtilComponents/Layout';
import { getDatasetsQuery } from '../../../queries/dataset';
import Error from '../../UtilComponents/Error';
import StyledWrapper from '../../../styles/utils';
import Loading from '../../UtilComponents/Loading';
import DatasetIntersection from '../../IntersectionComponents/DatasetIntersection/DatasetIntersection';

// an array with the columns of dataset table.
const table_columns = [
  {
    Header: 'Name',
    accessor: 'name',
    center: true,
    rowSpan: 2,
    Cell: (row) => (<Link to={`/datasets/${row.row.original.id}`}>{row.value}</Link>),
  },
];

/**
 *
 * @param {boolean} loading
 * @param {Error} error - takes the error as a param that is returned by the useQuery in case there is one.
 * @param {Array} columns
 * @param {Array} data
 */
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }
  return (
    <>
      <DatasetIntersection />
      <h2 style={{marginTop: '50px'}}>Datasets</h2>
      <Table columns={columns} data={data} />
    </>
  );
};

/**
 * Parent component for the datasets page.
 *
 * @component
 * @example
 *
 * returns (
 *   <Datasets/>
 * )
 */
const Datasets = () => {
  const { loading, error, data } = useQuery(getDatasetsQuery);
  const columns = React.useMemo(() => table_columns, []);
  const dataset_data = React.useMemo(() => (data ? data.datasets : []), [data]);
  return (
    <Layout page="datasets">
      <StyledWrapper>
        {
          renderComponent(loading, error, columns, dataset_data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Datasets;
