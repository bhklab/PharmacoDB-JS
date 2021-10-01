import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSingleCompoundTarget } from '../../../../queries/target';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data) => {
    let tableData = {
        data: [],
        ready: false,
    };
    if (typeof data !== 'undefined' && data.targets) {
        tableData.data = data.targets.map(item => ({
            compound: data.compound_name,
            target: item.target_name,
            gene_id: item.genes.map(el => el.id).join(', '),
            gene_name: item.genes.map(el => el.name).join(', '),
            gene_symbol: item.genes.map(el => el.annotation.symbol).join(', '),
        }));
        tableData.ready = true;
    }

    return tableData;
}

const AnnotatedTargetsTable = (props) => {
    const { compound } = props;

    const columns = [
        {
            Header: 'Target',
            accessor: 'target',
        },
        {
            Header: 'Associated Gene',
            accessor: 'gene_symbol',
            Cell: (item) => {
                if (item.value) {
                    let symbols = item.value.split(',');
                    let ids = item.row.original.gene_id.split(',');
                    return (ids.map((id, i) => (
                        <span key={i}>
                            <a href={`/genes/${id}`} target='_blank' rel='noopener noreferrer'>{symbols[i]}</a>{ i + 1 < ids.length ? ', ' : ''}
                        </span>)));
                } else {
                    return '';
                }
            }
        },
        {
            Header: 'Gene ID',
            accessor: 'gene_name',
            Cell: (item) => {
                if (item.value) {
                    let ids = item.value.split(',');
                    return (ids.map((id, i) => (
                        <span key={i}>
                            <a href={`http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${id}`} target='_blank' rel='noopener noreferrer'>{id}</a>{ i + 1 < ids.length ? ', ' : ''}
                        </span>)));
                } else {
                    return '';
                }
            }
        }
    ];

    const [tableData, setTableData] = useState({
        data: [],
        ready: false,
    });
    const [error, setError] = useState(false);

    const { loading } = useQuery(getSingleCompoundTarget, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.single_compound_target));
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
                                    {`Annotated Targets for ${compound.name}`}
                                </p>
                            </h4>
                            {
                                tableData.data.length > 0 ?
                                    tableData.ready &&
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
                                    :
                                    <p align="center">
                                        No targets found for {compound.name}
                                    </p>
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
