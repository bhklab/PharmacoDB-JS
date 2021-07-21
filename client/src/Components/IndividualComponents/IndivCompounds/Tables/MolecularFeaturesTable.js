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

const MOLECULAR_FEATURES_COLUMNS = [
    {
        Header: 'Feature Type',
        accessor: 'featureType',
    },
    {
        Header: 'Gene',
        accessor: 'gene',
        // Cell: (item) => {
        //     let datasets = item.cell.row.original.datasetObj;
        //     return(datasets.map((obj, i) => (
        //         <span key={i}>
        //             <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
        //         </span>)
        //     ));
        // }
    },
    {
        Header: 'Dataset',
        accessor: 'dataset',
        // Cell: (item) => {
        //     let datasets = item.cell.row.original.datasetObj;
        //     return(datasets.map((obj, i) => (
        //         <span key={i}>
        //             <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
        //         </span>)
        //     ));
        // }
    },
    {
        Header: 'Tissue',
        accessor: 'tissue',
        // Cell: (item) => {
        //     let tissues = item.row.original.tissueObj;
        //     return(tissues.map((obj, i) => (
        //         <span key={i}>
        //             <a href={`/tissues/${obj.id}`}>{obj.name}</a>{ i + 1 < tissues.length ? ', ' : ''}
        //         </span>)
        //     ));
        // }
    },
    {
        Header: 'Stat',
        accessor: 'stat',
    },
    {
        Header: 'Standardized Coefficient',
        accessor: 'standCoef',
    },
    {
        Header: 'Nominal ANOVA p-value',
        accessor: 'anovaPval',
    },
];

/**
 * Format data for the molecular features table
 * @param {Array} data from
 * @returns {Array} Object of formatted data for the table
 */
const formatMolFeaturesData = (data) => {
    // collect data of datasets and number of experiments for each tissue
    const tissuesObj = {};
    data.experiments.forEach((experiment) => {
        const {tissue, dataset} = experiment;
        const datasetObj = [];
        if (tissuesObj[tissue.name]) {
            if (!tissuesObj[tissue.name].datasets.includes(dataset.name)) {
                tissuesObj[tissue.name].datasets.push(dataset.name);
                tissuesObj[tissue.name].datasetObj.push({name : dataset.name, id : dataset.id});
                datasetObj.sort((a, b) => a - b);
            }
            tissuesObj[tissue.name].numExperiments += 1;
        } else {
            tissuesObj[tissue.name] = {
                tissueObj: [{name : [tissue.name], id : tissue.id}],
                datasets: [dataset.name],
                datasetObj : [{name : [dataset.name], id : dataset.id}],
                numExperiments: 1,
            };
        }
    });
    // assign values of collected tissue data to the columns
    if (data) {
        return Object.values(tissuesObj).map((x) => ({
            tissueObj: x.tissueObj,
            datasetObj: x.datasetObj,
            experiment_id: x.numExperiments,
        }));
    }
    return null;
};

/**
 * Section that displays Tissue Summary table for the individual compound page.
 *
 * @component
 * @example
 *
 * returns (
 *   <TissuesSummaryTable/>
 * )
 */
const MolecularFeaturesTable = (props) => {
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
                    <Table columns={MOLECULAR_FEATURES_COLUMNS} data={formatMolFeaturesData(queryData)} center={true} />
            }
            {
                error && <p>An error occurred</p>
            }
        </React.Fragment>
    );
};

MolecularFeaturesTable.propTypes = {
    compound: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default MolecularFeaturesTable;
