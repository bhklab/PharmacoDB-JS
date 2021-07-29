import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getGeneCompoundDatasetQuery } from '../../../../queries/gene_compound';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data) => {
    let tableData = {
        data: [],
        numCompounds: 0,
        numDatasets: 0
    };
    if (typeof data !== 'undefined') {
        let compoundIds = [...new Set(data.map(item => item.compound.id))];
        let datasetIds = [...new Set(data.map(item => item.dataset.id))];
        tableData.numCompounds = compoundIds.length;
        tableData.numDatasets = datasetIds.length;
        for(const compoundId of compoundIds){
            let filtered = data.filter(item => item.compound.id === compoundId);
            let experiments = filtered.map(item => item.n).reduce((a, b) => a + b, 0);
            
            let datasetIds = filtered.map(item => item.dataset.id);
            datasetIds = [...new Set(datasetIds)];
            let datasets = [];
            for(const datasetId of datasetIds){
                let dataset = filtered.find(item => item.dataset.id === datasetId).dataset;
                datasets.push(dataset);
            }
            tableData.data.push({
                compound_id: filtered[0].compound.id,
                compound: filtered[0].compound.name,
                datasets: datasets.map(item => item.name).join(', '),
                dataset_ids: datasets.map(item => item.id).join(', '),
                experiments: experiments
            }); 
        }
        tableData.data.sort((a, b) => b.experiments - a.experiments);
    }
    return tableData;
}

const CompoundsSummaryTable = (props) => {
    const { gene } = props;

    const columns = [
        {
            Header: `Compounds`,
            accessor: 'compound',
            center: true,
            Cell: (item) => <a href={`/compounds/${item.cell.row.original.compound_id}`}>{item.value}</a>
        },
        {
            Header: `Datasets`,
            accessor: 'datasets',
            center: true,
            Cell: (item) => {
                let datasets = item.cell.row.original.datasets.split(', ');
                let ids = item.cell.row.original.dataset_ids.split(', ');
                return(
                    datasets.map((item, i) => (
                        <span key={i}>
                            <a href={`/datasets/${ids[i]}`}>{item}</a>{ i + 1 < datasets.length ? ', ' : ''}
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

    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGeneCompoundDatasetQuery, {
        variables: { geneId: gene.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.gene_compound_dataset));
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    return(
        <React.Fragment>
            {
                loading ? <Loading />
                :
                error ? <Error />
                :
                <React.Fragment>
                    <h4>
                        <p align="center">
                            { `Compounds tested targetting ${gene.name}` }
                        </p>
                    </h4>
                    <p align="center">
                        { `${tableData.numCompounds} compounds have been tested on ${gene.name}, using data from ${tableData.numDatasets} dataset(s).` }
                    </p>
                    <div className='download-button'>
                        <DownloadButton 
                            label='CSV' 
                            data={tableData.data} 
                            mode='csv' 
                            filename={`${gene.name} - compounds`} 
                        />
                    </div>
                    <Table columns={columns} data={tableData.data} />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

CompoundsSummaryTable.propTypes = {
    gene: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default CompoundsSummaryTable;