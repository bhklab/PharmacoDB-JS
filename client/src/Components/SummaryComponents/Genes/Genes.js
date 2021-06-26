import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import Table from '../../UtilComponents/Table';
import { getGenesQuery } from '../../../queries/gene';
import Loading from '../../UtilComponents/Loading';

const table_columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'Gene Seq Start',
    accessor: 'gene_seq_start',
  },
  {
    Header: 'Gene Seq End',
    accessor: 'gene_seq_end',
  },
];

/**
 *
 * @param {Array} data - gene data from the genes API call.
 */
const getTableData = (data) => {
  let table_data = [];
  if (data) {
    table_data = data.genes.map((value) => {
      const { name, annotation } = value;
      const { ensg, gene_seq_end, gene_seq_start } = annotation;
      return {
        name,
        ensg,
        gene_seq_start,
        gene_seq_end,
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
 *  <h2> Title for the table </h2>
 *  <Table/>
 * )
 */
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h2>List of Genes</h2>
      <Table columns={columns} data={data} />
    </>
  );
};

/**
 * Parent component for the compounds page.
 *
 * @component
 * @example
 *
 * return (
 *   <Genes/>
 * )
 */
const Genes = () => {
  const { loading, error, data: gene_data } = useQuery(getGenesQuery);
  const columns = React.useMemo(() => table_columns, []);
  const data = React.useMemo(() => getTableData(gene_data), [gene_data]);
  console.log(gene_data);
  return (
    <Layout page="genes">
      <StyledWrapper>
        {
          renderComponent(loading, error, columns, data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Genes;
