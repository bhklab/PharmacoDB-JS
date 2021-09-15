/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetTestedCompoundsQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = ( datasetName, data, datasetId) => {
    if (typeof data !== 'undefined') {
        let compounds = data.compounds_tested;
        return compounds.map(item => ({dataset: datasetName, id: item.id, uid: item.uid, compound: item.name}));
    }
    return [];
}

const CompoundsSummaryTable = (props) => {
    const { dataset } = props;
    const [compounds, setCompounds] = useState([]);
    const [error, setError] = useState(false);

    const columns = [
        {
          Header: `All compounds tested in ${dataset.name}`,
          accessor: 'compound',
          center: true,
          Cell: (item) => <a href={`/compounds/${item.cell.row.original.uid}`}>{item.value}</a>
        }
    ];
    
    const { loading } = useQuery( getDatasetTestedCompoundsQuery, {
        variables: { datasetId: dataset.id },
        fetchPolicy: "network-only",
        onCompleted: (res) => {
            let data = res.dataset_type[0];
            data = { id : data.dataset.id, name: data.dataset.name, compounds_tested : data.compounds_tested}
            console.log(data);
            setCompounds(parseTableData(data.name, data, data.id));
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
