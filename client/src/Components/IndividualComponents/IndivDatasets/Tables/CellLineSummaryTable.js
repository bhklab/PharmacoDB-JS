/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCellLinesQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Error from '../../../UtilComponents/Error';
import Table from '../../../UtilComponents/Table/Table';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (datasetName, data, datasetId) => {
    let cellLines = []
    if (data && typeof data !== 'undefined') {
        let cells = data.dataset.find(item => item.id === datasetId).cells_tested;
        cellLines = cells.map(item => ({ dataset: datasetName, id: item.id, cell_uid: item.cell_uid, cellLine: item.name }));
    }
    return cellLines;
}

const CellLineSummaryTable = (props) => {
    const { dataset } = props;
    const [cellLines, setCellLines] = useState([]);
    const [error, setError] = useState(false);

    const columns = [
        {
            Header: `All cell lines tested in ${dataset.name}`,
            accessor: 'cellLine',
            center: true,
            Cell: (item) => <a href={`/cell_lines/${item.cell.row.original.cell_uid}`}>{item.value}</a>
        },
    ];

    const { loading } = useQuery(getDatasetCellLinesQuery, {
        variables: { datasetId: dataset.id },
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setCellLines(parseTableData(dataset.name, data, dataset.id));
        },
        onError: () => { setError(true) }
    });

    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    error ?
                        <Error message='this is a test message' />
                        :
                        <React.Fragment>
                            <div className='download-button'>
                                <DownloadButton label='CSV' data={cellLines} mode='csv' filename={`${dataset.name} - cell lines`} />
                            </div>
                            <Table columns={columns} data={cellLines} center={true} />
                        </React.Fragment>
            }
        </React.Fragment>
    );
}

CellLineSummaryTable.propTypes = {
    dataset: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default CellLineSummaryTable;
