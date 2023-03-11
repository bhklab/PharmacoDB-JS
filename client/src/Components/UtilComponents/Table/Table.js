import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table';
import TableStyles from './TableStyle';
import PropTypes from 'prop-types';
import searchIcon from '../../../images/magnif-glass.png';
import getMaxWidth from '../../../utils/maxWidthOfAnElement';

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
    <div className='search-container'>
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
    </div>
  );
};

/**
 *
 * @param {Array} columns - an array of table columns.
 * @param {Array} data - an array of data for the table.
 * @param {boolean} disablePagination - a boolean value to whether disable the pagination or not.
 * @param {boolean} showHeader - a boolean value to indicate whether the header is shown. Default is true.
 * @param {Array} defaultSort - specifies which column to be soted by default.
 * @param {function} highlightRows - If present, row rendering will use this function to highlight rows in specified color. (Usage example in MolecularFeaturesTable.js)
 */
const Table = ({ 
  columns, 
  data, 
  disablePagination = false, 
  defaultSort, 
  highlightRows = undefined, 
  showPageNumSelect = true, 
  showHeader = true,
}) => {
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
    initialState: { pageIndex: 0, sortBy: defaultSort ? defaultSort : [] },
  },
    useGlobalFilter,
    useSortBy,
    usePagination);

  /**
   * Function to format and render table rows.
   * Handles merging of cells with an identical value.
   * In order for the merge to work, the values need to be sorted.
   * @returns rows to be rendered
   */
  const renderRows = () => {
    // Get all the columns that are marked as merged
    let mergedCols = columns.filter(col => col.merged);

    // Count the number of values to be merged
    for(let col of mergedCols){
      let values = data.map(item => item[col.accessor]);
      col.mergedValues = [...new Set(values)].map(item => ({
        value: item, // Unique cell value
        count: values.filter(value => value === item).length, // Count of the value
        rendered: false // Indicates whether the value has been rendered or not.
      }));
    }

    let rows = page.map((row) => {
      prepareRow(row);
      return (
        <tr style={highlightRows ? highlightRows(row.original) : {}} {...row.getRowProps()}>
          {
            row.cells.map(
              (cell) => {
                let rowSpan = 0;
                /**
                 * If a column is marked as merged,
                 *  1. Find the values to be merged.
                 *  2. Set the rowSpan to the number of occurences of the merged value.
                 *  3. Set the rendered property as true (rendered only once)
                 */
                if(cell.column.merged){
                  let merged = mergedCols.find(item => cell.column.id === item.accessor)
                                .mergedValues.find(item => item.value === cell.value);
                  if(merged.count > 1){
                    if(!merged.rendered){
                      rowSpan = merged.count;
                      merged.rendered = true;
                    }
                  }else{
                    rowSpan = cell.column.rowSpan ? cell.column.rowSpan : 1;
                  }
                }else{
                  rowSpan = cell.column.rowSpan ? cell.column.rowSpan : 1;
                }
                return rowSpan > 0 ?
                <td className={cell.column.center ? 'center' : ''}{...cell.getCellProps()} rowSpan={rowSpan}>
                  {cell.render('Cell')}
                </td>
                :
                undefined
              }
            )
          }
        </tr>
      );
    });
    return (rows)
  }

  // Render the UI for your table
  return (
    <TableStyles showPageNumSelect={showPageNumSelect} style={{maxWidth: getMaxWidth(window.innerWidth)}}>
      {!disablePagination ? (
        <div className="top-settings">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          {
            showPageNumSelect &&
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
          }
        </div>

      ) : null}
      <table {...getTableProps()}>
        {
          showHeader && 
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map((column) => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                        {...column.getHeaderProps({
                          style: { width: '60' },
                        })}
                        colSpan={column.rowSpan ? column.rowSpan: 1}
                        >
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
        }
        <tbody {...getTableBodyProps()}>
          {
            renderRows()
          }
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
  defaultSort: PropTypes.arrayOf(Object)
};

Table.defaultProps = {
  data: [],
  columns: [],
  disablePagination: false,
};

export default Table;
