import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getGeneCompoundTissueDatasetQuery } from '../../../../queries/gene_compound';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data, gene) => {
    let tableData = [];
    if(typeof data !== 'undefined'){
        let filtered = data.filter(item => !!item.pvalue_analytic);
        tableData = filtered.map(item => ({
            gene_id: gene.id,
            gene: gene.name,
            feature_type: item.mDataType,
            compound_id: item.compound.id,
            compound: item.compound.name,
            dataset_id: item.dataset.id,
            dataset: item.dataset.name,
            tissue_id: item.tissue.id,
            tissue: item.tissue.name,
            stat: item.sens_stat,
            standardized_coef: item.estimate,
            pvalue: item.pvalue_analytic
        }));
        tableData.sort((a, b) => a.pvalue - b.pvalue);
    }
    return tableData;
}

const TopDrugsTable = (props) => {
    const { gene } = props;

    const columns = [
        {
            Header: `Feature Type`,
            accessor: 'feature_type',
        },
        {
            Header: `Compound`,
            accessor: 'compound',
            Cell: (item) => <Link to={`/compounds/${item.cell.row.original.compound_id}`}>{item.value}</Link>
        },
        {
            Header: `Dataset`,
            accessor: 'dataset',
            Cell: (item) => <Link to={`/datasets/${item.cell.row.original.dataset_id}`}>{item.value}</Link>
        },
        {
            Header: `Tissue`,
            accessor: 'tissue',
            Cell: (item) => <Link to={`/tissues/${item.cell.row.original.tissue_id}`}>{item.value}</Link>
        },
        {
            Header: `Stat`,
            accessor: 'stat',
        },
        {
            Header: `Standardized Coefficient`,
            accessor: 'standardized_coef',
            Cell: (item) => item.value.toFixed(2)
        },
        {
            Header: `Nominal ANOVA p-value`,
            accessor: 'pvalue',
            Cell: (item) => item.value.toExponential(2)
        }
    ];

    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGeneCompoundTissueDatasetQuery, {
        variables: { geneId: gene.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.gene_compound_tissue_dataset, gene));
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
                            { `Top compounds associated with response to ${gene.name}` }
                        </p>
                    </h4>
                    <div className='download-button'>
                        <DownloadButton 
                            label='CSV' 
                            data={tableData} 
                            mode='csv' 
                            filename={`${gene.name} - top compounds`} 
                        />
                    </div>
                    <Table columns={columns} data={tableData} />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

TopDrugsTable.propTypes = {
    gene: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default TopDrugsTable;