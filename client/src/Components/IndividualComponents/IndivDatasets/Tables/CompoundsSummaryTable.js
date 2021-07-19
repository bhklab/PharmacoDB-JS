/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCompoundQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';

const parseTableData = (data, datasetId) => {
    if (typeof data !== 'undefined') {
        let compounds = data.dataset.find(item => item.id === datasetId).compounds_tested;
        return compounds.map(item => ({compound: item.name, id: item.id}));
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
            setCompounds(parseTableData(data, dataset.id));
        },
        onError: () => {setError(true)}
    });

    return(
        <React.Fragment>
            {
                loading ?
                <Loading />
                :
                <Table columns={columns} data={compounds} />
            }
            {
                error && <p>An error occurred</p>
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