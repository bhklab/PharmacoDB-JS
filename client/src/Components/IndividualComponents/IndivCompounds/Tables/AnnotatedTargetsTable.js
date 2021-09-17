import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import { getGeneCompoundDatasetQuery } from '../../../../queries/gene_compound';
import { getGeneCompoundTarget } from '../../../../queries/target';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';

const parseTableData = (data) => {
    let tableData = {
        data: [],
        ready: false,
    };
    if (typeof data !== 'undefined') {
        tableData.data = data.targets.map(item => ({
            compound: data.compound_name,
            target: item.name,
            gene_id: item.gene.id,
            gene_name: item.gene.name,
            gene_symbol: item.gene.annotation.symbol
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
            Cell: (item) => <a href={`/genes/${item.row.original.gene_id}`}>{item.value}</a>
        },
        {
            Header: 'Gene ID',
            accessor: 'gene_name',
        }
    ];

    const [tableData, setTableData] = useState({
        data: [],
        ready: false,
    });
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGeneCompoundTarget, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            console.log(data);
            console.log(parseTableData(data.gene_compound_target))
            setTableData(parseTableData(data.gene_compound_target));
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
