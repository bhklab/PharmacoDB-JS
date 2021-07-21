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
        accessor: 'experiment_id',
    },
];

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
            experiment_id: x.numExperiments,
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
    const { id, name } = compound;
    const {
        loading,
        error,
        data: queryData,
    } = useQuery(getSingleCompoundExperimentsQuery, {
        variables: { compoundId: id },
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
                loading ?
                    <Loading />
                    :
                    <Table columns={CELL_SUMMARY_COLUMNS} data={formatCellSummaryData(queryData)} center={true} />
            }
            {
                error && <p>An error occurred</p>
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
