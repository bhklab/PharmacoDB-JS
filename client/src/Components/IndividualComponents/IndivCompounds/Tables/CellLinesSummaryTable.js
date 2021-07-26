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
        accessor: 'cellLineObj',
        Cell: (item) => {
            let cellLines = item.row.original.cellLineObj;
            return(cellLines.map((obj, i) => (
                <span key={i}>
                    <a href={`/cell_lines/${obj.id}`}>{obj.name}</a>{ i + 1 < cellLines.length ? ', ' : ''}
                </span>)
            ));
        }
    },
    {
        Header: 'Tissue Type',
        accessor: 'tissue',
        Cell: (item) => {
            let tissues = item.row.original.tissueObj;
            return(tissues.map((obj, i) => (
                <span key={i}>
                    <a href={`/tissues/${obj.id}`}>{obj.name}</a>{ i + 1 < tissues.length ? ', ' : ''}
                </span>)
            ));
        }
    },
    {
        Header: 'Datasets',
        accessor: 'dataset',
        Cell: (item) => {
            let datasets = item.cell.row.original.datasetObj;
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
 * csv
 */
const csvData = (data) => {
    console.log(data);
    return data.map(item => ({
        cellLineId: item.cellLineObj[0].id,
        cellLineName: item.cellLineObj[0].name,
        tissueId: item.tissueObj[0].id,
        tissueName: item.tissueObj[0].name,
        dataset: item.datasetObj[0].name,
        numExperiments: item.num_experiments,
    }));
};

/**
 * Format data for the cell Line summary table
 * @param {Array} data from experiment API for a given compound
 * @returns {Array} Object of cellLines, datasets, and tissues for the table
 */
const formatCellSummaryData = (data) => {
    // collect data of datasets, tissues and number of experiments for each cell line
    const cellLineObj = {};
    data.experiments.forEach((experiment) => {
        const {cell_line, tissue, dataset} = experiment;
        const datasetObj = [];
        if (cellLineObj[cell_line.name]) {
            if (!cellLineObj[cell_line.name].datasets.includes(dataset.name))
            {
                cellLineObj[cell_line.name].datasets.push(dataset.name);
                cellLineObj[cell_line.name].datasetObj.push({name : dataset.name, id : dataset.id});
                datasetObj.sort((a, b) => a - b);
            }
            cellLineObj[cell_line.name].numExperiments += 1;
        } else {
            cellLineObj[cell_line.name] = {
                cellObj: [{name : cell_line.name, id : cell_line.id}],
                datasets: [dataset.name],
                tissueObj: [{name : [tissue.name], id : tissue.id}],
                datasetObj : [{name : [dataset.name], id : dataset.id}],
                numExperiments: 1,
            };
        }
    });
    // assign values of collected compound data to the columns
    if (data) {
        return Object.values(cellLineObj).map((x) => ({
            cellLineObj: x.cellObj,
            tissueObj: x.tissueObj,
            datasetObj: x.datasetObj,
            num_experiments: x.numExperiments,
        }));
    }
    return null;
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
    const [csv, setCSV] = useState([]);
    const [error, setError] = useState(false);
    const { loading, data: queryData,} = useQuery(getSingleCompoundExperimentsQuery, {
        variables: { compoundId: compound.id },
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
    csvData(formatCellSummaryData(queryData));
    return (
        <React.Fragment>
            {
                error && <p> Error! </p>
            }
            {
                loading ?
                    <Loading />
                    :
                    <React.Fragment>
                        <div className='download-button'>
                            <DownloadButton
                                label='CSV'
                                data={csvData(formatCellSummaryData(queryData))}
                                mode='csv'
                                filename={`${compound.name} - cellLines`}
                            />
                        </div>
                        <Table columns={CELL_SUMMARY_COLUMNS} data={formatCellSummaryData(queryData)}/>
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
