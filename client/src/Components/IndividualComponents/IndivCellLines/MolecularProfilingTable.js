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
    // prepare returned data from api for molecular profiling table
    const dataObject = {}
    if (data) data.forEach((x)=> {
        // each data row contains dataset id and name, mDataTypes and num_profs, and allDataTypes
        const datasetId = x['dataset']['id']
        // create an object for each dataset if visited for the first time, otherwise just update it
        if (!dataObject[datasetId]) {
            dataObject[datasetId] = {};
            dataObject[datasetId]['dataset'] = x['dataset'];
            dataObject[datasetId]['dataset']['molProf'] = {};
            x['dataTypes'].forEach((dataType) => dataObject[datasetId]['dataset']['molProf'][dataType] = "-" )
        }
        dataObject[datasetId]['dataset']['molProf'][x['mDataType']] = x['num_prof'];
    }
    )
    return dataObject;
}

const MolecularProfilingTable = (props) => {
    const { cellLine } = props;
    const { loading, error, data } = useQuery(getMolCellQuery, {
        variables: { cellLineId: cellLine.id}
    });

    if (!loading) console.log(parseTableData(data["mol_cell"]));
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
