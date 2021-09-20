import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import { getGenesQuery } from '../../../queries/gene';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';

const table_columns = [
  {
    Header: 'Name',
    accessor: 'symbol',
    Cell: (row) => (<Link to={`/genes/${row.row.original.id}`}>{row.value}</Link>),
    center: true,
  },
  {
    Header: 'Ensembl ID',
    accessor: 'name',
    Cell: (row) => (
        <a href={`http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${row.row.original.name}`} target="_blank">
          <div style={{ textAlign: 'center' }}> {row.row.original.name} </div>
        </a>),
  },
];

/**
 *
 * @param {Array} data - gene data from the genes API call.
 */
const getTableData = (data) => {
  let table_data = [];
  // create updated data.
  if (data) {
    table_data = data.genes.map((value) => {
      const { name, annotation, id } = value;
      const { symbol, ensg, gene_seq_end, gene_seq_start } = annotation;
      return {
        id,
        name: name,
        symbol: symbol || "N/A",
        ensg,
        gene_seq_start,
        gene_seq_end,
      };
    });
  }
  // sorting the data based on the symbol.
  table_data.sort((a, b) => a.symbol.toUpperCase().localeCompare(b.symbol.toUpperCase()));

  return table_data;
};

const GenesTable = () => {

  const [genes, setGenes] = useState([]);
  const [error, setError] = useState(false);

  const { loading } = useQuery(getGenesQuery, {
    onCompleted: (data) => {
      console.log(data)
      setGenes(getTableData(data));
    },
    onError: (err) => {
      console.log(err);
      setError(true);
    }
  });

  return (
    <React.Fragment>
      <h3>Gene names</h3>
      {
        loading ? <Loading />
          :
          error ? <Error />
            :
            genes.length > 0 &&
            <Table columns={table_columns} data={genes} />
      }
    </React.Fragment>
  )
}

export default GenesTable;
