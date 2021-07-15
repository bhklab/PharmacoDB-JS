/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getMolCellQuery } from '../../../queries/mol';

const MOLECULAR_PROFILING_COLUMNS = [
    {
        Header: 'Datasets',
        accessor: 'name',
    },
    {
        Header: 'rna',
        accessor: 'tissue',
    },
];


const parseTableData = (data) => {
    // find distinct molecular data types
    dataTypes = []
    data.forEach((x)=> i)
    if (typeof data !== 'undefined') {
        let compounds = data.dataset.find(item => item.id === datasetId).compounds_tested;
        return compounds.map(item => ({compound: item}));
    }
    return [];
}

const MolecularProfilingTable = (props) => {
    const { cellLine } = props;
    const { loading, error, data } = useQuery(getMolCellQuery, {
        variables: { cellLineId: cellLine.id}
    });

    const { data: data1} = useQuery(getMolCellQuery, {
        variables: { cellLineId: cellLine.id}
    });
    console.log(data,data1);
    return(
        <React.Fragment>
        </React.Fragment>
    );
}

MolecularProfilingTable.propTypes = {
    cellLine: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default MolecularProfilingTable;
