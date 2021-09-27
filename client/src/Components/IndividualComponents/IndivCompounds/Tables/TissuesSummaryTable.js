/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleCompoundExperimentsQuery } from '../../../../queries/experiments';
import Loading from '../../../UtilComponents/Loading';
import PieChart from '../../../Plots/PieChart';
import Table from '../../../UtilComponents/Table/Table';
import DownloadButton from '../../../UtilComponents/DownloadButton';
import { Link } from 'react-router-dom';

/**
 * Format data for the tissue summary table
 * @param {Array} data from experiment API for a given compound
 * @returns {Array} Object of formatted data for the table
 */
const formatTissueSummaryData = (data) => {
    // collect data of datasets and number of experiments for each tissue
    let tableData = { ready: false, tissue: [], numTissues: 0, numDataset: 0 };
    if (data) {
        let uniqueDatasets = [...new Set(data.map(item => item.dataset.id))];
        let uniqueTissues = [...new Set(data.map(item => item.tissue.id))];
        let tissues = [];
        for(let id of uniqueTissues){
            let experiments = data.filter(item => item.tissue.id === id);

            let datasets = experiments.map(item => item.dataset);
            let datasetIds = [...new Set(datasets.map(item => item.id))];
            let datasetList = [];
            for(let id of datasetIds){
                let found = datasets.find(item => item.id === id);
                datasetList.push(found);
            }
            datasetList.sort((a, b) => a - b);

            tissues.push({
                tissue: experiments[0].tissue.name,
                dataset: datasetList.map(item => item.name).join(' '),
                num_experiments: experiments.length,
                id: experiments[0].tissue.id,
                datasetList: datasetList
            });
        }
        tissues.sort((a, b) => b.num_experiments - a.num_experiments);
        tableData.tissue = tissues;
        tableData.numTissues = uniqueTissues.length;
        tableData.numDataset = uniqueDatasets.length;
        tableData.ready = true;
    }
    return tableData;
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
const TissuesSummaryTable = (props) => {
    const { compound } = props;
    const [tableData, setTableData] = useState({ ready: false, tissue: [], numTissues: 0, numDataset: 0 });
    const [plotData, setPlotData] = useState([]);
    const [csv, setCSV] = useState([]);
    const [error, setError] = useState(false);

    const history = useHistory();

    const TISSUE_SUMMARY_COLUMNS = [
        {
            Header: 'Tissue',
            accessor: 'tissue',
            Cell: (item) => (<Link to={`/tissues/${item.row.original.id}`}>{item.value}</Link>),
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
            Cell: (item) => <a href={`/search?compound=${compound.name}&tissue=${item.cell.row.original.tissue}`} target="_blank" rel="noopener noreferrer">{item.value}</a>
        },
    ];

    /**
     * Redirects to Tissue vs Compound page when a plot trace is clicked.
     * @param {*} e onclick event
     */
    const redirectToTissueCompound = (e) => {
        history.push(`/search?tissue=${e.points[0].label}&compound=${compound.name}`);
    }

    const { loading } = useQuery(getSingleCompoundExperimentsQuery, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            let parsed = formatTissueSummaryData(data.experiments);
            setPlotData([{
                values: parsed.tissue.map(item => item.num_experiments),
                labels: parsed.tissue.map(item => item.tissue),
                name: '',
                hovertemplate: parsed.tissue.map(item => (
                    `${item.tissue}<br />` + 
                    `${item.num_experiments} experiments<br />`
                )),
                hole: 0.55,
                type: 'pie',
              }]);
            setTableData(parsed);
            setCSV(parsed.tissue.map(item => ({
                compoundId: compound.id,
                compoundName: compound.name,
                tissueId: item.id,
                tissueName: item.tissue,
                dataset: item.dataset,
                numExperiments: item.num_experiments,
            })));
        },
        onError: (err) => {
            setError(true);
        }
    });

    return (
        <React.Fragment>
            {
                error && <p> Error! </p>
            }
            {
                loading ?
                <Loading />
                :
                tableData.tissue.length > 0 ?
                <React.Fragment>
                    <h4>
                        <p align='center'>Relative percentage of experiments using {compound.name} per tissue</p>
                    </h4>
                    <PieChart 
                        id='tissueSummaryPieChart'
                        data={plotData} 
                        height={600} 
                        onClick={redirectToTissueCompound} 
                    />
                    <h4>
                        <p align="center">
                            { `Tissues tested with ${compound.name}` }
                        </p>
                    </h4>
                    <p align="center">
                        { `${tableData.numTissues} tissue(s) have been tested with this compound, using data from ${tableData.numDataset} dataset(s).` }
                    </p>
                    <div className='download-button'>
                        <DownloadButton
                            label='CSV'
                            data={csv}
                            mode='csv'
                            filename={`${compound.name} - tissues`}
                        />
                    </div>
                    <Table columns={TISSUE_SUMMARY_COLUMNS} data={tableData.tissue}/>
                </React.Fragment>
                :
                <p align="center">
                    No tissues have been tested with {compound.name}.
                </p>
            }
        </React.Fragment>
    );
};

TissuesSummaryTable.propTypes = {
    compound: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default TissuesSummaryTable;
