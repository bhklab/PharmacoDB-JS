import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getMolecularProfilingQuery } from '../../../../queries/molecular_profiling';
import Table from '../../../UtilComponents/Table/Table';
import Loading from '../../../UtilComponents/Loading';
import { Link } from 'react-router-dom';
import { convertMDataType, mDataTypeList } from '../../../../utils/convertMDataType';

/**
 * Format data for Molecular Profiling Table
 * @param {Array} data molecular profiling data from the mol_cell API
 * @return List of datasets and the number of profiles for each molecular data types
 * available on the database for a given cellLine
 */
const generateTableData = (data) => {
    let tableData = { ready: false, molProf: [] };
    if (data && data.length > 0) {
        // filter only the entries with mDataTypes of interest
        let converted = data.map(item => ({
            dataset: item.dataset,
            mDataType: convertMDataType(item.mDataType),
            num_prof: item.num_prof
        })).filter(item => Object.values(mDataTypeList).includes(item.mDataType));

        // organize the entries by dataset
        let datasets = [...new Set(converted.map(item => item.dataset.name))].sort((a, b) => a.localeCompare(b));
        datasets.forEach(dataset => {
            let filtered = converted.filter(item => item.dataset.name === dataset)
            let obj = {
                id: filtered[0].dataset.id,
                dataset_name: dataset,
            };
            Object.keys(mDataTypeList).forEach(key => {
                let mDataEntries = filtered.filter(item => item.mDataType === mDataTypeList[key]); // filter all the datatype in the dataset by datatype name.
                if (mDataEntries.length) {
                    obj[key] = mDataEntries.map(item => item.num_prof).reduce((a, b) => a + b, 0);
                } else {
                    obj[key] = '-'; // '-' if the molecular data type doesn't exist in the dataset
                }
            });
            tableData.molProf.push(obj);
        });
        tableData.ready = true;
        return tableData;
    }
}

/**
 * Format columns tags data for dynamic molecular profiling table
 * @param {Array} data molecular profiling data from the mol_cell API
 * @return List of objects with headers and accessors
 * Cells of datasets are clickable and other columns change based on the availble mDataTypes on database
 */
const COLUMNS = () => {
    const columns = [];
    columns.push(
        {
            Header: 'Datasets',
            accessor: 'dataset_name',
            Cell: (row) => (<Link to={`/datasets/${row.row.original.id}`}>{row.value}</Link>),
        }
    )
    Object.keys(mDataTypeList).forEach(key => {
        columns.push({
            Header: mDataTypeList[key],
            accessor: key
        });
    });
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

    const { loading } = useQuery(getMolecularProfilingQuery, {
        variables: { cellLineId: cellLine.id },
        onCompleted: (data) => {
            let parsed = generateTableData(data.molecular_profiling);
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
                loading || !tableData.ready ?
                    <Loading />
                    :
                    tableData.molProf.length > 0 ?
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
                                tableData.molProf.length > 0 &&
                                <Table columns={COLUMNS()} data={tableData.molProf} center={true} />
                            }
                        </React.Fragment>
                        :
                        <h6 align="center">
                            No molecular profiling data with {cellLine.name} is available in PharmacoGx.
                </h6>
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
