/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getDatasetCompoundQuery } from '../../../../queries/dataset';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';

const parseTableData = (data, datasetId) => {
    if (typeof data !== 'undefined') {
        let compounds = data.dataset.find(item => item.id === datasetId).compounds_tested;
        return compounds.map(item => ({compound: item}));
    }
    return [];
}

const CompoundsSummaryTable = (props) => {
    const { dataset } = props;

    const { loading, error, data } = useQuery(getDatasetCompoundQuery, {
        variables: { datasetId: dataset.id }
    });
    const compounds = useMemo(() => parseTableData(data, dataset.id), [data]);

    const columns = [
        {
          Header: `All compounds lines tested in ${dataset.name}`,
          accessor: 'compound',
        }
    ];

    return(
        <React.Fragment>
            {
                loading ?
                <Loading />
                :
                <Table columns={columns} data={compounds} center={true} />
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