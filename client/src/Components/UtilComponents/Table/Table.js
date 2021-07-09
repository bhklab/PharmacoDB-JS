import React from 'react';
import {
  useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce,
} from 'react-table';
import TableStyles from './TableStyle';
import PropTypes from 'prop-types';
import searchIcon from '../../../images/magnif-glass.png';


/**
 * Filter for global search of table
 */
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <img className="search-icon" alt="search icon" src={searchIcon} />
      <input
        className="search"
        type="text"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} rows...`}
      />
    </>
  );
};

/**
 * 
 * @param {Array} columns - an array of table columns.
 * @param {Array} data - an array of data for the table.
 * @param {boolean} disablePagination - a boolean value to whether disable the pagination or not.
 * @param {boolean} center - a boolean value used to center cell content (used for sing-column tables)
 */
const Table = ({ columns, data, disablePagination = false, center = false }) => {
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
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0 },
  },
    useGlobalFilter,
    useSortBy,
    usePagination);

  // Render the UI for your table
  return (
    <TableStyles>
      {!disablePagination ? (
        <div className="top-settings">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
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
            console.log(row.cells);
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells.map(
                    (cell) => (
                      <td className={center ? 'center' : ''}{...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    )
                  )
                }
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
    </TableStyles>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(Object).isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
  disablePagination: PropTypes.bool,
};

Table.defaultProps = {
  data: [],
  columns: [],
  disablePagination: false,
};

export default Table;
