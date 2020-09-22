import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../../Utils/Table';
import Layout from '../../Utils/Layout';
import { getDatasetsQuery } from '../../../queries/dataset';
import StyledWrapper from '../../../styles/utils';
import Loading from '../../Utils/Loading';

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

const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h2>List of Datasets</h2>
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
 * return (
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
