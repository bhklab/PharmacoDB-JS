/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCellLineExperimentsQuery } from '../../../../queries/experiments';
import dataset_colors from '../../../../styles/dataset_colors';
import Loading from '../../../UtilComponents/Loading';
import ProfileCompound from '../../../Plots/ProfileCompound';
import Table from '../../../UtilComponents/Table/Table';
import { NotFoundContent } from '../../../UtilComponents/NotFoundPage';
import { Link } from 'react-router-dom';

const DRUG_SUMMARY_COLUMNS = [
    {
        Header: 'Compounds',
        accessor: 'compound',
        Cell: (item) => (<Link to={`/compounds/${item.row.original.compoundId}`}>{item.value}</Link>),
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
const formatDrugSummaryData = (data) => {
    // collect data of datasets and number of experiments for each compound
    const compoundObj = {};
    data.experiments.forEach((experiment) => {
        const compoundName = experiment.compound.name;
        const datasetName = experiment.dataset.name;
        const datasetId = experiment.dataset.id;
        const datasetObj = [];
        if (compoundObj[compoundName]) {
            if (!compoundObj[compoundName].datasets.includes(datasetName))
            {
                compoundObj[compoundName].datasets.push(datasetName);
                compoundObj[compoundName].datasetObj.push({name: datasetName, id:datasetId});
                datasetObj.sort((a, b) => a - b);
            }
            compoundObj[compoundName].numExperiments += 1;
        } else {
            compoundObj[compoundName] = {
                compound: compoundName,
                compoundId: experiment.compound.id,
                datasets: [datasetName],
                datasetObj : [{name: datasetName, id:datasetId}],
                numExperiments: 1,
            };
        }
    });
    // assign values of collected compound data to the columns
    if (data) {
        return Object.values(compoundObj).map((x) => ({
            compoundId: x.compoundId,
            compound: x.compound,
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
const CompoundsSummaryTable = (props) => {
    const { cellLine } = props;
    const { id } = cellLine;
    const {
        loading,
        error,
        data: queryData,
    } = useQuery(getSingleCellLineExperimentsQuery, {
        variables: { cellLineId: id },
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
                    <Table columns={DRUG_SUMMARY_COLUMNS} data={formatDrugSummaryData(queryData)} center={true} />
            }
            {
                error && <p>An error occurred</p>
            }
        </React.Fragment>
    );
};

CompoundsSummaryTable.propTypes = {
    cellLine: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default CompoundsSummaryTable;
