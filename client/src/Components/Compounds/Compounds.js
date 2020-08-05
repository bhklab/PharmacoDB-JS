import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../Table/Table';
import Layout from '../Utils/Layout';
import { getCompoundsQuery } from '../../queries/queries';
import StyledWrapper from '../../styles/utils';
import BarPlot from '../Plots/BarPlot';

const table_columns = [
  {
    Header: 'Name',
    accessor: 'name',
  },
  {
    Header: 'SMILES',
    accessor: 'smiles',
  },
  {
    Header: 'InChIKeys',
    accessor: 'inchikey',
  },
  {
    Header: 'PubChem',
    accessor: 'pubchem',
  },
  {
    Header: 'FDA Status',
    accessor: 'fda_status',
  },
];

/**
 *
 * @param {Array} data - the compound data from the compounds API.
 */
const getTableData = (data) => {
  let table_data = [];
  if (data) {
    table_data = data.compounds.map((value) => {
      const { name, annotation } = value;
      return {
        name,
        smiles: annotation.smiles,
        inchikey: annotation.inchikey,
        pubchem: annotation.pubchem,
        fda_status: annotation.fda_status,
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
 *  <h3> Title for barplot </h3>
 *  <BarPlot/>
 *  <h2> Title for the table </h2>
 *  <Table/>
 * )
 */
const renderComponent = (loading, error, columns, data) => {
  if (loading) {
    return <p> Loading... </p>;
  }
  if (error) {
    return <p> Error! </p>;
  }
  return (
    <>
      <h3> Number of Compounds Tested in Each Dataset </h3>
      <BarPlot />
      <h2> List of Compounds </h2>
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
 *   <Compounds/>
 * )
 */
const Compounds = () => {
  const { loading, error, data: compound_data } = useQuery(getCompoundsQuery);
  const columns = React.useMemo(() => table_columns, []);
  const data = React.useMemo(() => getTableData(compound_data));
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

export default Compounds;
