/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../../queries/experiments';
import dataset_colors from '../../../../styles/dataset_colors';
import Loading from '../../../UtilComponents/Loading';
import ProfileCompound from '../../../Plots/ProfileCompound';
import Table from '../../../UtilComponents/Table/Table';
import { NotFoundContent } from '../../../UtilComponents/NotFoundPage';
import DownloadButton from '../../../UtilComponents/DownloadButton';
import { Link } from 'react-router-dom';

const CELL_SUMMARY_COLUMNS = [
    {
        Header: 'Cell Line',
        accessor: 'cellLine',
        Cell: (item) => (<Link to={`/cell_lines/${item.row.original.id}`}>{item.value}</Link>),
    },
    {
        Header: 'Tissue Type',
        accessor: 'tissue',
        Cell: (item) => (<Link to={`/tissues/${item.row.original.tissue.id}`}>{item.row.original.tissue.name}</Link>),
    },
    {
        Header: 'Datasets',
        accessor: 'dataset',
        Cell: (item) => {
            let datasets = item.cell.row.original.datasetList;
            return(datasets.map((obj, i) => (
                <span key={i}>
                    <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
                </span>)
            ));
        }
    },
    {
        Header: 'Experiments',
        accessor: 'num_experiments',
    },
];

/**
 * Format data for the cell Line summary table
 * @param {Array} data from experiment API for a given compound
 * @returns {Array} Object of cellLines, datasets, and tissues for the table
 */
const generateTableData = (data) => {
    // collect data of datasets, tissues and number of experiments for each cell line
    let tableData = { ready: false, cellLine: [], numCellLines: 0, numDataset: 0 };
    if (data) {
        let uniqueDatasets = [...new Set(data.map(item => item.dataset.id))];
        let uniqueCellLines = [...new Set(data.map(item => item.cell_line.id))];
        let cellLines = [];
        for(let id of uniqueCellLines){
            let experiments = data.filter(item => item.cell_line.id === id);

            let datasets = experiments.map(item => item.dataset);
            let datasetIds = [...new Set(datasets.map(item => item.id))];
            let datasetList = [];
            for(let id of datasetIds){
                let found = datasets.find(item => item.id === id);
                datasetList.push(found);
            }
            datasetList.sort((a, b) => a - b);

            cellLines.push({
                cellLine: experiments[0].cell_line.name,
                dataset: datasetList.map(item => item.name).join(' '),
                tissue: experiments[0].tissue,
                num_experiments: experiments.length,
                id: experiments[0].cell_line.id,
                datasetList: datasetList
            });
        }
        cellLines.sort((a, b) => b.num_experiments - a.num_experiments);
        tableData.cellLine = cellLines;
        tableData.numCellLines = uniqueCellLines.length;
        tableData.numDataset = uniqueDatasets.length;
        tableData.ready = true;
    }
    return tableData;
};

/**
 * Section that display Cell Line Summary table for the individual compound page.
 *
 * @component
 * @example
 *
 * returns (
 *   <CellLinesSummaryTable/>
 * )
 */
const CellLinesSummaryTable = (props) => {
    const { compound } = props;
    const [tableData, setTableData] = useState({ ready: false, cellLine: [], numCellLines: 0, numDataset: 0 });
    const [csv, setCSV] = useState([]);
    const [error, setError] = useState(false);

    const { loading, data: queryData,} = useQuery(getSingleCompoundExperimentsQuery, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            console.log(data);
            let parsed = generateTableData(data.experiments);
            setTableData(parsed);
            setCSV(parsed.cellLine.map(item => ({
                compoundId: compound.id,
                compoundName: compound.name,
                cellLineId: item.id,
                cellLine: item.cellLine,
                tissueId: item.tissue.id,
                tissueName: item.tissue.name,
                dataset: item.dataset,
                numExperiments: item.num_experiments,
            })));
        },
        onError: (err) => {
            setError(true);
        }
    });
    // load data from query into state
    const [experiment, setExperiment] = useState({
        data: {},
        loaded: false,
    });
    // to set the state on the change of the data.
    useEffect(() => {
        if (queryData !== undefined) {
            setExperiment({
                data: queryData.experiments,
                loaded: true,
            });
        }
    }, [queryData]);
    return (
        <React.Fragment>
            {
                error && <p> Error! </p>
            }
            {
                loading || !tableData.ready ?
                    <Loading />
                    :
                    <React.Fragment>
                        <h4>
                            <p align="center">
                                { `Compounds tested with ${compound.name}` }
                            </p>
                        </h4>
                        <p align="center">
                            { ` compounds have been tested with this cell line, using data from  dataset(s).` }
                        </p>
                        <div className='download-button'>
                            <DownloadButton
                                label='CSV'
                                data={csv}
                                mode='csv'
                                filename={`${compound.name} - cellLines`}
                            />
                        </div>
                        <Table columns={CELL_SUMMARY_COLUMNS} data={tableData.cellLine}/>
                    </React.Fragment>
            }
        </React.Fragment>
    );
};

CellLinesSummaryTable.propTypes = {
    compound: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default CellLinesSummaryTable;
