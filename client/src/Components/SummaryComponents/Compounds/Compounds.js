import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Table from '../../UtilComponents/Table/Table';
import Layout from '../../UtilComponents/Layout';
import { Link } from 'react-router-dom';
import { getCompoundsQuery } from '../../../queries/compound';
import StyledWrapper from '../../../styles/utils';
import BarPlot from '../../Plots/BarPlot';
import Loading from '../../UtilComponents/Loading';

// links for pubchem and dtc.
const PUBCHEM_LINK = 'https://pubchem.ncbi.nlm.nih.gov/compound/';
const CHEMBL_LINK = 'https://www.ebi.ac.uk/chembl/compound_report_card/';

const table_columns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: (row) => (<Link to={`/compounds/${row.row.original.uid}`}>{row.value}</Link>),
  },
  {
    Header: 'Datasets',
    accessor: 'dataset',
    Cell: (item) => {
      let datasets = item.cell.row.original.dataset;
      return (datasets.map((obj, i) => (
        obj.id
          ? (
            <span key={i}>
              <a href={`/datasets/${obj.id}`}>{obj.name}</a>{i + 1 < datasets.length ? ', ' : ''}
            </span>
          )
          : (
            <span key={i}>{obj.name}</span>
          )
        )
      ));
    }
  },
  {
    Header: 'SMILES',
    accessor: 'smiles',
    Cell: (item) => {return item.value || 'NA'} ,
  },
  {
    Header: 'InChIKeys',
    accessor: 'inchikey',
  },
  {
    Header: 'PubChem',
    accessor: 'pubchem',
    Cell: (item) => {
      let pubchem = item.cell.row.original.pubchem;
      if(pubchem){
        return(pubchem.map((id, i) => (
          <span key={i}>
            <a href={`${PUBCHEM_LINK}${id}`} target='_blank' rel='noopener noreferrer'>{id}</a>{ i + 1 < pubchem.length ? ', ' : ''}
          </span>)
        ));
      }else{
        return '';
      }
    }
  },
  {
    Header: 'ChEMBL',
    accessor: 'chembl',
    Cell: (row) => (<a href={`${CHEMBL_LINK}${row.value}`} target='_blank' rel='noopener noreferrer'>{row.value}</a>),
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
      const { name, annotation, id, uid, dataset } = value;
      const {
        smiles, inchikey, fda_status, chembl
      } = annotation;
      const pubchem = annotation.pubchem ? annotation.pubchem.split("///") : null;
      return {
        id,
        name,
        uid,
        smiles,
        inchikey,
        pubchem,
        fda_status,
        chembl,
        dataset
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
      <Table columns={columns} data={data} defaultSort={[{ id: 'fda_status' }]} />
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
  const { loading, error, data: compound_data } = useQuery(getCompoundsQuery, {fetchPolicy: "cache-first"});
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
