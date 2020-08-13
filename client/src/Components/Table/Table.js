/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, usePagination } from 'react-table';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';

const Styles = styled.div`
  margin-bottom: 5rem;
  font-size: calc(0.3vw + 8px);
  overflow-x: auto;
  table {
    border-spacing: 0;
    border: 1px solid ${colors.white_smoke};
    margin-top: 2rem;
    width: 100%;

    th,
    td {
      color: ${colors.dark_teal_heading};
      max-width: 200px;
      margin: 0;
      padding: calc(0.3vw + 0.3em);
      border-bottom: 1px solid ${colors.white_smoke};
      border-right: 1px solid ${colors.white_smoke};
      overflow-x: auto;
      font-size: calc(0.18vw + 1em);
      // hiding the scrollbar but still able to scroll.
      ::-webkit-scrollbar {
        width: 0px;
        height: 0px;
        background: transparent;
      }
      :last-child {
        border-right: 0;
      }

      @media only screen and (max-width: 1082px) { 
        max-width:100px;
      }
    }

    tr {
      :last-child {
        td {
          border-bottom: 0px solid ${colors.white_smoke};
        }
      }
    }
  
    th {
      font-weight: 700;
      background-color: ${colors.pale_teal};
      border: 1px solid ${colors.white_smoke} !important;
    }
  }

  .pagination {
    padding: 1.0rem;
    color: ${colors.dark_teal_heading};
    input, select, option, button {
      color: ${colors.dark_teal_heading};
      border: 1px solid ${colors.white_smoke};
    }
    font-size: calc(0.15vw + 1em);
  }
`;

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
    <Styles>
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
    </Styles>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(Object).isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
};

export default Table;
