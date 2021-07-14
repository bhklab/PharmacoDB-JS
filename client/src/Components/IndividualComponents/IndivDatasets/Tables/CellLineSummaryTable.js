/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo, useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCellLinesQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';

const parseTableData = (data, datasetId) => {
    console.log(datasetId);
    if (data && typeof data !== 'undefined') {
        let cells = data.dataset.find(item => item.id === datasetId).cells_tested;
        return cells.map(item => ({cellLine: item}));
    }
    return [];
}

const CellLineSummaryTable = (props) => {
    const { dataset } = props;

    const {loading, error, data} = useQuery(getDatasetCellLinesQuery, {
        variables: { datasetId: dataset.id },
        fetchPolicy: "network-only"
    });
    const cellLines = useMemo(() => parseTableData(data, dataset.id), [data]);

    const columns = [
        {
          Header: `All cell lines tested in ${dataset.name}`,
          accessor: 'cellLine',
          center: true
        },
    ];

    return(
        <React.Fragment>
            {
                loading ?
                <Loading />
                :
                <Table columns={columns} data={cellLines} center={true} />
            }
            {
                error && <p>An error occurred</p>
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