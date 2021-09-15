/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
// import { getDatasetCompoundQuery } from '../../../../queries/dataset';
import { getDatasetsTypesQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = ( datasetName, data, datasetId) => {
    if (typeof data !== 'undefined') {
        // let compounds = data.dataset.find(item => item.id === datasetId).compounds_tested;
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
          Cell: (item) => <a href={`/compounds/${item.cell.row.original.id}`}>{item.value}</a>
        }
    ];

    // const { loading } = useQuery(getDatasetCompoundQuery, {
    //     variables: { datasetId: dataset.id },
    //     fetchPolicy: "network-only",
    //     onCompleted: (data) => {
    //         console.log(data);
    //         setCompounds(parseTableData(data, dataset.id, dataset.name));
    //     },
    //     onError: () => {setError(true)}
    // });

    const { loading } = useQuery(getDatasetsTypesQuery, {
        fetchPolicy: "network-only",
        onCompleted: (res) => {
            let data = res.datasets_types.filter(d => d.dataset.id === dataset.id)[0];
            data = { id : data.dataset.id, name: data.dataset.name, compounds_tested : data.compounds_tested}
            console.log(dataset);
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
