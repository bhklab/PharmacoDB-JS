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
      accessor: 'name',
      Cell: (row) => (<Link to={`/genes/${row.row.original.id}`}>{row.value}</Link>),
    },
    {
        Header: 'Symbol',
        accessor: 'symbol',
    },
    // {
    //   Header: 'Gene Seq Start',
    //   accessor: 'gene_seq_start',
    // },
    // {
    //   Header: 'Gene Seq End',
    //   accessor: 'gene_seq_end',
    // },
];

/**
 *
 * @param {Array} data - gene data from the genes API call.
 */
 const getTableData = (data) => {
    let table_data = [];
    if (data) {
      table_data = data.genes.map((value) => {
        const { name, annotation, id } = value;
        const { symbol, ensg, gene_seq_end, gene_seq_start } = annotation;
        return {
          id,
          // name: symbol ? symbol : name,
          name: name,
          symbol: symbol ? symbol : "N/A",
          ensg,
          gene_seq_start,
          gene_seq_end,
        };
      });
    }
    table_data.sort((a, b) => a.name.localeCompare(b.name));
    return table_data;
};

const GenesTable = () => {

    const [genes, setGenes] = useState([]);
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGenesQuery, {
        onCompleted: (data) => {
            console.log("log data in GenesTable:",data);
            setGenes(getTableData(data));
        },
        onError: (err) => {
          console.log(err);
          setError(true);
        }
    });

    return(
        <React.Fragment>
            <h3>List of Genes</h3>
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
