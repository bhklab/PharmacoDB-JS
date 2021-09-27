/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueCellLinesQuery } from '../../../../queries/experiments';
import Loading from '../../../UtilComponents/Loading';
import Error from '../../../UtilComponents/Error';
import Table from '../../../UtilComponents/Table/Table';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const CELL_LINE_SUMMARY_COLUMNS = [
    {
      Header: <div align="center">Cell lines</div> ,
      accessor: 'cellLine',
      center: true,
      Cell: (item) => <a href={`/cell_lines/${item.cell.row.original.uid}`}>{item.value}</a>
    },
];

/**
 * Collect data for the cell line summary table
 * @param {Array} data cell line summary data from the experiment API
 */
 const generateTableData = (tissue, data) => {
    let cellLines = [];
    if(data){
        let ids = [...new Set(data.experiments.map(item => item.cell_line.id))];
        for(let id of ids){
            cellLines.push(data.experiments.find(item => item.cell_line.id === id));
        }
        cellLines = cellLines.map(item => ({
            tissueId: tissue.id,
            tissueName: tissue.name,
            cellLine: item.cell_line.name,
            uid: item.cell_line.cell_uid,
            id: item.cell_line.id
        }));
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
            setCellLines(generateTableData(tissue, data));
        },
        onError: () => {
            setError(true);
        }
    });

    return(
        <React.Fragment>
            {
                loading ? <Loading />
                :
                error ? <Error />
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
                    <div className='download-button'>
                        <DownloadButton label='CSV' data={cellLines} mode='csv' filename={`${tissue.name} - cell lines`} />
                    </div>
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
