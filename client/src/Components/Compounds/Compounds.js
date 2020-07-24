/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react';
import { useTable, useSortBy } from 'react-table'
import { useQuery } from '@apollo/react-hooks';
import Layout from '../Utils/Layout';
import { getCompoundsQuery } from '../../queries/queries';
import StyledWrapper from '../../styles/utils';
import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`


const getTableColumns = () => {
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
	return table_columns;
}

const getTableData = (data) => {
	if(data) {
		const table_data = data.compounds.map(value => {
			const { name, annotation } = value;
			return {
				'name' : name,
				'smiles' : annotation['smiles'],
				'inchikey' : annotation['inchikey'],
				'pubchem' : annotation['pubchem'],
				'fda_status' : annotation['fda_status']
			}
		})
		return table_data;
	}
}

const Table = ({ columns, data }) => {
	// Use the state and functions returned from useTable to build your UI
	const {
	  getTableProps,
	  getTableBodyProps,
	  headerGroups,
	  rows,
	  prepareRow,
	} = useTable(
		{
			columns,
			data,
		},
		useSortBy
	)
  
	// Render the UI for your table
	return (
	  <table {...getTableProps()}>
		<thead>
		  {headerGroups.map(headerGroup => (
			<tr {...headerGroup.getHeaderGroupProps()}>
			  {headerGroup.headers.map(column => (
				// Add the sorting props to control sorting. For this example
                // we can add them into the header props
				<th {...column.getHeaderProps(column.getSortByToggleProps())}>
					{column.render('Header')}
					{/* Add a sort direction indicator */}
					<span>
						{column.isSorted
						? column.isSortedDesc
							? ' 🔽'
							: ' 🔼'
						: ''}
                  	</span>
				</th>
			  ))}
			</tr>
		  ))}
		</thead>
		<tbody {...getTableBodyProps()}>
		  {rows.map((row, i) => {
			prepareRow(row)
			return (
			  <tr {...row.getRowProps()}>
				{row.cells.map(cell => {
				  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
				})}
			  </tr>
			)
		  })}
		</tbody>
	  </table>
	)
  }


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
	const columns = React.useMemo(() => getTableColumns())
	const data = React.useMemo(() => getTableData(compound_data))
	console.log(columns, data, loading)
	return (
		<Layout>
			<StyledWrapper>
			{
				loading ? (<p>Loading...</p>)
				: (
					error ? (<p>Error!</p>) : <Styles> <Table columns={columns} data={data} /> </Styles>
				)
			}
			</StyledWrapper>
		</Layout>
	);
};

export default Compounds;
