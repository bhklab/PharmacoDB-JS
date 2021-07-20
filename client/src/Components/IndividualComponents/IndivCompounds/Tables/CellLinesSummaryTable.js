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

const DRUG_SUMMARY_COLUMNS = [
    {
        Header: 'Cell Line',
        accessor: 'cellLineName',
        // Cell: (item) => (<Link to={`/compounds/${item.row.original.compoundId}`}>{item.value}</Link>),
    },
    {
        Header: 'Tissue Type',
        accessor: 'tissue',
        // Cell: (item) => {
        //     let tissues = item.cell.row.original.tissueObj;
        //     return(tissues.map((obj, i) => (
        //         <span key={i}>
        //             <a href={`/tissues/${obj.id}`}>{obj.name}</a>{ i + 1 < tissues.length ? ', ' : ''}
        //         </span>)
        //     ));
        // }
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
 * Format data for the synonyms table
 * @param {Array} data synonym data from the cell line API
 */
const formatCellSummaryData = (data) => {
    // collect data of datasets and number of experiments for each cell line
    const cellLineObj = {};
    data.experiments.forEach((experiment) => {
        const {cell_line, tissue, dataset} = experiment;
        console.log("12121",cell_line, tissue, dataset)
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
                cellLineObj: [{name : cell_line.name, id : cell_line.id}],
                datasets: [dataset.name],
                tissueObj: {name : [tissue.name], id : dataset.id},
                datasetObj : [{name : dataset.name, id : dataset.id}],
                numExperiments: 1,
            };
        }
    });
    // assign values of collected compound data to the columns
    if (data) {
        return Object.values(cellLineObj).map((x) => ({
            cellLineId: x.cellLineId,
            cellLine: x.cellLine,
            tissueObj: x.tissue,
            datasetObj: x.datasetObj,
            experiment_id: x.numExperiments,
        }));
    }
    return null;
};

/**
 * Section that display plots for the individual cell Line page.
 *
 * @component
 * @example
 *
 * returns (
 *   <PlotSection/>
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
    console.log(queryData);
    return (
        <React.Fragment>
            {
                loading ?
                    <Loading />
                    :
                    <Table columns={DRUG_SUMMARY_COLUMNS} data={formatCellSummaryData(queryData)} center={true} />
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
