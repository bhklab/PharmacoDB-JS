import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import Error from '../../../UtilComponents/Error';
import DownloadButton from '../../../UtilComponents/DownloadButton';
import { getCompountsGeneTarget } from '../../../../queries/target';

const parseTableData = (data) => {
    const {
        gene,
        compounds
    } = data;
    let tableData = {
        data: [],
        numCompounds: 0,
    };
    console.log(data);
    if (data.compounds !== null) {
        let compoundIds = [...new Set(data.compounds.map(item => item.compound_id))];
        tableData.numCompounds = compoundIds.length;
        compounds.forEach (compound =>
        {
            tableData.data.push({
                gene_id: gene.annotation.id,
                gene_name: gene.annotation.symbol,
                compound_id: compound.compound_id,
                compound_uid: compound.compound_uid,
                compound: compound.compound_name,
                target_id: compound.targets[0].id,
                target: compound.targets[0].name,
            });
        })

        console.log(tableData)
        // for (const compoundId of compoundIds) {
        //     let filtered = data.filter(item => item.compound.id === compoundId);
        //     console.log()
        //
        //     tableData.data.push({
        //         gene_id: gene.annotation.id,
        //         gene: gene.annotation.symbol,
        //         compound_id: compounds.compound.id,
        //         compound_uid: compounds.compound.uid,
        //         compound: compounds.compound_name,
        //         target_id: compounds.targets.id,
        //         target: compounds.targets.name,
        //     });
        // }
        tableData.data.sort((a, b) => b.compound - a.compound);
        console.log(tableData)
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

    const { loading } = useQuery(getCompountsGeneTarget, {
        variables: { geneId: gene.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.compounds_gene_target));
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
