/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueCellLinesQuery } from '../../../../queries/experiments';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';

const CELL_LINE_SUMMARY_COLUMNS = [
    {
      Header: 'Cell Line',
      accessor: 'cellLine',
      center: true
    },
];

/**
 * Collect data for the drug summary table
 * @param {Array} data drug summary data from the experiment API
 */
 const generateTableData = (data) => {
    let cellLines = [];
    if(data){
        let ids = [...new Set(data.experiments.map(item => item.cell_line.id))];
        for(let id of ids){
            cellLines.push(data.experiments.find(item => item.cell_line.id === id));
        }
        cellLines = cellLines.map(item => ({cellLine: item.cell_line.name}));
    }
    return cellLines;
};

const CellLineSummaryTable = (props) => {
    const { tissue } = props;
    const [cellLines, setCellLines] = useState([]);
    const [error, setError] = useState(false);
    
    const { loading } = useQuery(getSingleTissueCellLinesQuery, {
        variables: { tissueId: tissue.id },
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setCellLines(generateTableData(data));
        },
        onError: () => {setError(true)}
    });

    return(
        <React.Fragment>
            {
                error && <p> Error! </p>
            }
            {
                loading ? <Loading />
                :
                <React.Fragment>
                  <h4>
                    <p align="center">
                      {`Cell lines of ${tissue.name} tissue type`}
                    </p>
                  </h4>
                  <p align="center">
                    {`${cellLines.length} cell line(s) of this tissue type are currently recorded in database.`}
                  </p>
                  <Table columns={CELL_LINE_SUMMARY_COLUMNS} data={cellLines} />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

CellLineSummaryTable.propTypes = {
    tissue: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default CellLineSummaryTable;