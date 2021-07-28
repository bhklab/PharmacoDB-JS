/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCompoundQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data, datasetId, datasetName) => {
    if (typeof data !== 'undefined') {
        let compounds = data.dataset.find(item => item.id === datasetId).compounds_tested;
        return compounds.map(item => ({dataset: datasetName, id: item.id, compound: item.name}));
    }
    return [];
}

const CompoundsSummaryTable = (props) => {
    const { dataset } = props;
    const [compounds, setCompounds] = useState([]);
    const [error, setError] = useState(false);

    const columns = [
        {
          Header: `All compounds lines tested in ${dataset.name}`,
          accessor: 'compound',
          center: true,
          Cell: (item) => <a href={`/compounds/${item.cell.row.original.id}`}>{item.value}</a> 
        }
    ];

    const { loading } = useQuery(getDatasetCompoundQuery, {
        variables: { datasetId: dataset.id },
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            console.log(data);
            setCompounds(parseTableData(data, dataset.id, dataset.name));
        },
        onError: () => {setError(true)}
    });

    return(
        <React.Fragment>
            {
                loading ? <Loading />
                :
                error ? <Error />
                :
                <React.Fragment>
                    <div className='download-button'>
                        <DownloadButton label='CSV' data={compounds} mode='csv' filename={`${dataset.name} - compounds`} />
                    </div>
                    <Table columns={columns} data={compounds} />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

CompoundsSummaryTable.propTypes = {
    dataset: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default CompoundsSummaryTable;