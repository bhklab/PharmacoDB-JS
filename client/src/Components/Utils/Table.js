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
  margin-top: 2rem;
  font-size: calc(0.3vw + 8px);
  overflow-x: auto;
  table {
    border-spacing: 0;
    border: 1px solid ${colors.white_smoke};
    width: 100%;

    th,
    td {
      color: ${colors.dark_gray_text};
      max-width: 200px;
      margin: 0;
      padding: calc(0.3vw + 0.3em);
      border-bottom: 1px solid ${colors.white_smoke};
      border-right: 1px solid ${colors.white_smoke};
      overflow-x: auto;
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
      color: ${colors.dark_teal_heading};
      border: 1px solid white !important;
    }
  }

  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1.0rem 0;
    color: ${colors.dark_teal_heading};

    
    input, select, option {
      color: ${colors.dark_teal_heading};
      border: 1px solid ${colors.white_smoke};
    }
    button {
      cursor: pointer;
      background:${colors.dark_teal_heading};
      color: white;
      border: none;
      padding: 3px 10px;
      border-radius: 5px;

      &:disabled {
        background: ${colors.white_smoke};
        color: ${colors.dark_gray_text};
      }
    }
    .next {
      margin-left: 1rem;
    }
    .prev {
      margin-right: 1rem;
    }
  }
  .show-page {
    padding-bottom: 1rem;
    color: ${colors.dark_teal_heading};
    select {
      border: 1px solid ${colors.white_smoke};
      color: ${colors.dark_teal_heading};
    }
  }
`;

const Table = ({ columns, data, disablePagination = false }) => {
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
      {!disablePagination ? (
        <div className="show-page">
          Show
          {' '}
          {' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          {' '}
          {' '}
          entries per page
        </div>
      ) : null}

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
      {!disablePagination ? (
        <div className="pagination">
          <button className="prev" onClick={() => previousPage()} disabled={!canPreviousPage}>
            Prev
          </button>
          <span>
            Page
            {' '}
            <strong>
              <input
                type="number"
                defaultValue={pageIndex + 1}
                value={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: '40px' }}
              />
              {' '}
              of
              {' '}
              {pageOptions.length}
            </strong>
            {' '}
          </span>
          <button className="next" onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      ) : null}
    </Styles>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(Object).isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
  disablePagination: PropTypes.bool,
};

Table.defaultProps = {
  disablePagination: false,
};

export default Table;
