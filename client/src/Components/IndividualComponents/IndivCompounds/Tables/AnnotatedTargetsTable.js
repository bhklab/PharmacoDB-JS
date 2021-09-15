import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getGeneCompoundDatasetQuery } from '../../../../queries/gene_compound';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data, compound) => {
    let tableData = {
        data: [],
        ready: false,
        numGenes: 0,
        numDatasets: 0
    };
    if (typeof data !== 'undefined') {
        let geneIds = [...new Set(data.map(item => item.gene.id))];
        let datasetIds = [...new Set(data.map(item => item.dataset.id))];
        tableData.numGenes = geneIds.length;
        tableData.numDatasets = datasetIds.length;
        for (const geneId of geneIds) {
            let filtered = data.filter(item => item.gene.id === geneId);
            // let experiments = filtered.map(item => item.n).reduce((a, b) => a + b, 0);
            let datasetIds = filtered.map(item => item.dataset.id);
            datasetIds = [...new Set(datasetIds)];
            let experiments = datasetIds.length;
            let datasets = [];
            for (const datasetId of datasetIds) {
                let dataset = filtered.find(item => item.dataset.id === datasetId).dataset;
                datasets.push(dataset);
            }
            tableData.data.push({
                compound_id: compound.id,
                compound_name: compound.name,
                gene_id: filtered[0].gene.id,
                gene: filtered[0].gene.name,
                datasets: datasets.map(item => item.name).join(', '),
                dataset_ids: datasets.map(item => item.id).join(', '),
                experiments: experiments
            });
        }
        tableData.data.sort((a, b) => b.experiments - a.experiments);
        tableData.ready = true;
    }
    return tableData;
}

const AnnotatedTargetsTable = (props) => {
    const { compound } = props;

    const columns = [
        {
            Header: `Genes`,
            accessor: 'gene',
            center: true,
            Cell: (item) => <Link to={`/genes/${item.cell.row.original.gene_id}`}>{item.value}</Link>
        },
        {
            Header: `Datasets`,
            accessor: 'datasets',
            center: true,
            Cell: (item) => {
                let datasets = item.cell.row.original.datasets.split(', ');
                let ids = item.cell.row.original.dataset_ids.split(', ');
                return (
                    datasets.map((item, i) => (
                        <span key={i}>
                            <Link to={`/datasets/${ids[i]}`}>{item}</Link>{i + 1 < datasets.length ? ', ' : ''}
                        </span>
                    ))
                )
            }
        },
        {
            Header: `Experiments`,
            accessor: 'experiments',
            center: true,
        }
    ];

    const [tableData, setTableData] = useState({
        data: [],
        ready: false,
        numGenes: 0,
        numDatasets: 0
    });
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGeneCompoundDatasetQuery, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.gene_compound_dataset, compound));
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    return (
        <React.Fragment>
            {
                loading ? <Loading />
                    :
                    error ? <Error />
                        :
                        <React.Fragment>
                            <h4>
                                <p align="center">
                                    {`Genes tested targetting ${compound.name}`}
                                </p>
                            </h4>
                            <p align="center">
                                {
                                    tableData.ready
                                        ? tableData.numGenes
                                            ? `${tableData.numGenes} genes have been tested on ${compound.name}, using data from ${tableData.numDatasets} dataset(s).`
                                            : `There is no target information for ${compound.name}.`
                                        : `Processing data, please wait...`
                                }
                            </p>
                            {
                                tableData.data.length > 0 &&
                                <React.Fragment>
                                    <div className='download-button'>
                                        <DownloadButton
                                            label='CSV'
                                            data={tableData.data}
                                            mode='csv'
                                            filename={`${compound.name} - genes`}
                                        />
                                    </div>
                                    <Table columns={columns} data={tableData.data} />
                                </React.Fragment>
                            }
                        </React.Fragment>
            }
        </React.Fragment>
    );
}

AnnotatedTargetsTable.propTypes = {
    compound: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default AnnotatedTargetsTable;
