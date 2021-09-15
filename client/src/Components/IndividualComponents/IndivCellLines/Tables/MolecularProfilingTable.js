import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getMolCellQuery } from '../../../../queries/mol';
import Table from '../../../UtilComponents/Table/Table';
import Loading from '../../../UtilComponents/Loading';
import { Link } from 'react-router-dom';

/**
 * Format data for Molecular Profiling Table
 * @param {Array} data molecular profiling data from the mol_cell API
 * @return List of datasets and the number of profiles for each molecular data types
 * available on the database for a given cellLine
 */
const generateTableData = (data) => {
    let tableData = { ready: false, molProf: [] };
    const dataObject = {}
    if (data && data.length > 0) {
        data.forEach((x) => {
            // each data row contains dataset id and name, mDataTypes and num_profs, and allDataTypes
            const datasetId = x['dataset']['id']
            // create an object for each dataset if visited for the first time, otherwise just update it
            if (!dataObject[datasetId]) {
                dataObject[datasetId] = {};
                dataObject[datasetId]['dataset'] = x['dataset'];
                dataObject[datasetId]['dataset']['molProf'] = {};
                x['dataTypes'].forEach((dataType) =>
                    dataObject[datasetId]['dataset']['molProf'][dataType.replace(/[^a-zA-Z]/g, "").toLowerCase()] = "-"
                )
            }
            dataObject[datasetId]['dataset']['molProf'][x['mDataType'].replace(/[^a-zA-Z]/g, "").toLowerCase()] = x['num_prof'];
        }
        )
    }
    const molProf = [];
    for (const [key, value] of Object.entries(dataObject)) {
        molProf.push({ id: key, dataset_name: value['dataset']['name'], ...value['dataset']['molProf'] })
    }
    tableData.molProf = molProf;
    tableData.ready = true;
    return tableData;
}

/**
 * Format columns tags data for dynamic molecular profiling table
 * @param {Array} data molecular profiling data from the mol_cell API
 * @return List of objects with headers and accessors
 * Cells of datasets are clickable and other columns change based on the availble mDataTypes on database
 */
const COLUMNS = (data) => {
    const columns = [];
    columns.push(
        {
            Header: 'Datasets',
            accessor: 'dataset_name',
            Cell: (row) => (<Link to={`/datasets/${row.row.original.id}`}>{row.value}</Link>),
        }
    )
    // remove non-alphabetic characters to be able to assign to the accessors
    for (const [key, value] of Object.entries(data)) {
        value['dataTypes'].forEach((molProf) =>
            columns.push({ Header: molProf, accessor: molProf.replace(/[^a-zA-Z]/g, "").toLowerCase() })
        )
        break;
    };
    return columns;
}

/**
 * A helper function that processes data from the API to be subsequently loaded into
 * Molecular Profiling Table component in Individual Cell Line page.
 * @param {Object} CellLine id and name
 * @returns (
 *   <MolecularProfilingTable/>
 * )
 */
const MolecularProfilingTable = (props) => {
    const { cellLine } = props;
    const [tableData, setTableData] = useState({ ready: false, compound: [], numCompounds: 0, numDataset: 0 });
    const [error, setError] = useState(false);

    const { loading, data } = useQuery(getMolCellQuery, {
        variables: { cellLineId: cellLine.id },
        onCompleted: (data) => {
            let parsed = generateTableData(data["mol_cell"]);
            setTableData(parsed);
        },
        onError: (err) => {
            setError(true);
        }
    });
    return (
        <React.Fragment>
            {
                error && <p>An error occurred</p>
            }
            {
                loading || !tableData.ready ? <Loading />
                    :
                    <React.Fragment>
                        <h4>
                            <p align="center">
                                {`Available Molecular Profiling in PharmacoGx`}
                            </p>
                        </h4>
                        <p align="center">
                            {`# of profiles of each type per dataset`}
                        </p>
                        {
                            tableData.molProf.length ?
                                <Table columns={COLUMNS(data["mol_cell"])} data={tableData.molProf} center={true} />
                                : ''
                        }
                    </React.Fragment>
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
