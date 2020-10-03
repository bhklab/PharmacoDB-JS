import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../../UtilComponents/Table';
import Layout from '../../UtilComponents/Layout';
import { getCompoundsQuery } from '../../../queries/compound';
import StyledWrapper from '../../../styles/utils';
import BarPlot from '../../Plots/BarPlot';
import Loading from '../../UtilComponents/Loading';

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
 * @param {Array} data - compound data from the compounds API call.
 */
const getTableData = (data) => {
  let table_data = [];
  if (data) {
    table_data = data.compounds.map((value) => {
      const { name, annotation } = value;
      const {
        smiles, inchikey, pubchem, fda_status,
      } = annotation;
      return {
        name,
        smiles,
        inchikey,
        pubchem,
        fda_status,
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
 *  <h3> Title for the barplot </h3>
 *  <BarPlot/>
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
      <h2 className="new-section"> Number of Compounds Tested in Each Dataset </h2>
      <BarPlot />
      <h2 className="new-section">List of Compounds</h2>
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
  const data = React.useMemo(() => getTableData(compound_data), [compound_data]);
  return (
    <Layout page="compounds">
      <StyledWrapper>
        {
          renderComponent(loading, error, columns, data)
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Compounds;
