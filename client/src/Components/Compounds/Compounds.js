/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import Layout from '../Utils/Layout';
import { getCompoundsQuery } from '../../queries/queries';
import StyledWrapper from '../../styles/utils';
import colors from '../../styles/colors';
import BarPlot from '../Plots/BarPlot';

const Styles = styled.div`
  padding: 5rem;
  table {
    border-spacing: 0;
    border: 1px solid ${colors.light_teal};
    margin-top: 2rem;
    
    tr {
      :last-child {
        td {
          border-bottom: 0px solid ${colors.light_teal};
        }
      }
    }

    th {
      font-size: 1.4rem;
      font-weight: 700;
      background-color: ${colors.light_teal};
      border: 1px solid ${colors.pale_teal} !important;
    }

    th,
    td {
      color: ${colors.dark_teal_heading};
      font-size: 1.15rem;
      min-width: 200px;
      max-width: 200px;
      margin: 0;
      padding: 0.75rem;
      border-bottom: 1px solid ${colors.light_teal};
      border-right: 1px solid ${colors.light_teal};
      overflow-x: auto;
      // hiding the scrollbar but still able to scroll.
      ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }
      // ::-webkit-scrollbar {
      //   width: 4px;
      //   height: 4px;
      // }
      // ::-webkit-scrollbar-thumb {
      //   background: ${colors.teal};
      // }
      // ::-webkit-scrollbar-thumb:hover {
      //   background: ${colors.dark_teal_heading};
      // }
      // ::-webkit-scrollbar-track {
      //   background: ${colors.light_teal};
      // }
      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 1.0rem;
    color: ${colors.dark_teal_heading};
    input, select, option, button {
      color: ${colors.dark_teal_heading};
      border: 1px solid ${colors.light_teal};
    }
  }
`;

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

const getTableData = (data) => {
  if (data) {
    const table_data = data.compounds.map((value) => {
      const { name, annotation } = value;
      return {
        name,
        smiles: annotation.smiles,
        inchikey: annotation.inchikey,
        pubchem: annotation.pubchem,
        fda_status: annotation.fda_status,
      };
    });
    return table_data;
  }
};

const Table = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0 },
  },
  useSortBy,
  usePagination);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
                headerGroup.headers.map((column) => (
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
                ))
              }
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        {' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        {' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        {' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        {' '}
        <span>
          Page
          {' '}
          <strong>
            {pageIndex + 1}
            {' '}
            of
            {' '}
            {pageOptions.length}
          </strong>
          {' '}
        </span>
        <span>
          | Go to page:
          {' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>
        {' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show
              {' '}
              {pageSize}
            </option>
          ))}
        </select>
      </div>
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
          loading ? (<p>Loading...</p>)
            : (
              error ? (<p>Error!</p>) : (
                <>
                  <h3> Number of Compounds Tested in Each Dataset </h3>
                  <BarPlot />
                  <Styles>
                    <h2> Compounds </h2>
                    <Table columns={columns} data={data} />
                  </Styles>
                </>
              )
            )
        }
      </StyledWrapper>
    </Layout>
  );
};

export default Compounds;
