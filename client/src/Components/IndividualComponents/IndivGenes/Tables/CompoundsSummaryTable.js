import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';
import { getSingleGeneTarget } from '../../../../queries/target';

const parseTableData = (data) => {
    let tableData = {
        data: [],
        numCompounds: 0,
    };

    if (data.compounds !== null) {
        data.targets.forEach(target => {
            target.compounds.forEach(compound => {
                tableData.numCompounds += 1;

                tableData.data.push({
                    gene_id: data.gene_id,
                    gene_name: data.gene_annotation.symbol,
                    compound_id: compound.id,
                    compound_uid: compound.uid,
                    compound: compound.name,
                    target_id: target.target_id,
                    target: target.target_name,
                });
            })
        })
        tableData.data.sort((a, b) => b.compound - a.compound);
    }

    return tableData;
};

const CompoundsSummaryTable = (props) => {
    const { gene } = props;

    const columns = [
        {
            Header: `Compounds`,
            accessor: 'compound',
            center: true,
            Cell: (item) => <Link to={`/compounds/${item.cell.row.original.compound_uid}`}>{item.value}</Link>
        },
        {
            Header: `Targets`,
            accessor: 'target',
            center: true,
        },
    ];

    const [tableData, setTableData] = useState({
        data: [],
        numCompounds: 0,
    });
    const [error, setError] = useState(false);

    const { loading } = useQuery(getSingleGeneTarget, {
        variables: { geneId: gene.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.single_gene_target));
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
                                    {`Compounds targeting ${gene.annotation.symbol}`}
                                </p>
                            </h4>
                            <p align="center">
                                {
                                    tableData.numCompounds
                                        ? `${tableData.numCompounds} compounds have targeted ${gene.annotation.symbol}.`
                                        : `There are no drugs targeting ${gene.annotation.symbol} in the database`
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
                                            filename={`${gene.annotation.symbol} - compounds`}
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

CompoundsSummaryTable.propTypes = {
    gene: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired
}

export default CompoundsSummaryTable;
