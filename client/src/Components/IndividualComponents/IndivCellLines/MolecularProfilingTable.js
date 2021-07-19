/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getMolCellQuery } from '../../../queries/mol';
import Table from '../../UtilComponents/Table/Table';
import Loading from '../../UtilComponents/Loading';
import { Link } from 'react-router-dom';


const generateTableData = (data) => {
    // prepare returned data from api for molecular profiling table
    const dataObject = {}
    if (data && data.length>0) data.forEach((x)=> {
        // each data row contains dataset id and name, mDataTypes and num_profs, and allDataTypes
        const datasetId = x['dataset']['id']
        // create an object for each dataset if visited for the first time, otherwise just update it
        if (!dataObject[datasetId]) {
            dataObject[datasetId] = {};
            dataObject[datasetId]['dataset'] = x['dataset'];
            dataObject[datasetId]['dataset']['molProf'] = {};
            x['dataTypes'].forEach((dataType) =>
                dataObject[datasetId]['dataset']['molProf'][dataType.replace(/[^a-zA-Z]/g,"").toLowerCase()] = "-"
            )
        }
        dataObject[datasetId]['dataset']['molProf'][x['mDataType'].replace(/[^a-zA-Z]/g,"").toLowerCase()] = x['num_prof'];
    }
    )
    const tableData = []
    for (const [key, value] of Object.entries(dataObject)) {
        tableData.push({id: key, dataset_name:value['dataset']['name'] ,...value['dataset']['molProf'] })
    }
    return tableData;
}

const COLUMNS = (data) => {
    const columns = [];
    columns.push(
        {
        Header: 'Datasets',
        accessor: 'dataset_name',
        Cell: (row) => (<Link to={`/datasets/${row.row.original.id}`}>{row.value}</Link>),
        }
    )
    for (const [key, value] of Object.entries(data)) {
        value['dataTypes'].forEach ((molProf) =>
            columns.push({Header: molProf, accessor: molProf.replace(/[^a-zA-Z]/g,"").toLowerCase()})
        )
        break;
        };
    return columns;
}

const MolecularProfilingTable = (props) => {
    const { cellLine } = props;
    const { loading, error, data } = useQuery(getMolCellQuery, {
        variables: { cellLineId: cellLine.id}
    });

    return(
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <Table columns={COLUMNS(data["mol_cell"])} data={generateTableData(data["mol_cell"])} center={true} />
            }
            {
                error && <p>An error occurred</p>
            }
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
