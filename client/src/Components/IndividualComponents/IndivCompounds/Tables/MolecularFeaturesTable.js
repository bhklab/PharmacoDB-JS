import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getGeneCompoundTissueDatasetQuery } from '../../../../queries/gene_compound';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';
import { Link } from 'react-router-dom';
import { convertMDataType } from '../../../../utils/convertMDataType';
import DownloadButton from '../../../UtilComponents/DownloadButton';
import Error from '../../../UtilComponents/Error';
import colors from '../../../../styles/colors';

const parseTableData = (data, compound) => {
    let tableData = [];
    if (typeof data !== 'undefined') {
        let filtered = data.filter(item => !!item.pvalue_analytic);
        tableData = filtered.map(item => ({
            compound_id: compound.id,
            compound: compound.name,
            feature_type: convertMDataType(item.mDataType),
            gene_id: item.gene.id,
            gene: item.gene.annotation.symbol,
            dataset_id: item.dataset.id,
            dataset: item.dataset.name,
            tissue_id: item.tissue.id,
            tissue: item.tissue.name,
            stat: item.sens_stat,
            correlation: item.estimate,
            pvalue_analytic: item.pvalue_analytic,
            permutation_pvalue: item.pvalue_permutation,
            significant_permutation: item.significant_permutation,
        }));
        tableData.sort((a, b) => a.pvalue - b.pvalue);
    }
    return tableData;
};

const highlightRowsByCorrelation = (rowData) => {
    let style = { backgroundColor: '' };
    if(Math.sign(rowData.correlation) === 1) style.backgroundColor = colors.light_pink_highlight;
    if(Math.sign(rowData.correlation) === -1) style.backgroundColor = colors.light_teal_highlight; 
    return style;
};

const COLUMNS = [
    {
        Header: 'Feature Type',
        accessor: 'feature_type',
    },
    {
        Header: 'Gene',
        accessor: 'gene',
        Cell: (item) => <Link to={`/genes/${item.cell.row.original.gene_id}`}>{item.value}</Link>
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
        Header: 'Sensitivity Metric',
        accessor: 'stat',
    },
    {
        Header: `Correlation`,
        accessor: 'correlation',
        Cell: (item) => item.value.toFixed(2),
        sortType: 'basic',
        sortMethod: (a, b) => parseFloat(a)-parseFloat(b)
    },
    {
        Header: `Analytic P Value`,
        accessor: 'pvalue_analytic',
        Cell: (item) => item.value.toExponential(2),
        sortType: 'basic',
        sortMethod: (a, b) => parseFloat(a)-parseFloat(b)
    },
    {
        Header: `Permutation P Value`,
        accessor: 'permutation_pvalue',
        Cell: (item) => item.value ? item.value.toExponential(2) : 'N/A',
        sortType: 'basic',
    },
];


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
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(false);

    const { loading } = useQuery(getGeneCompoundTissueDatasetQuery, {
        variables: { compoundId: compound.id },
        onCompleted: (data) => {
            setTableData(parseTableData(data.gene_compound_tissue_dataset, compound));
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
                        tableData.length > 0 ?
                        <React.Fragment>
                            <h4>
                                <p align="center">
                                    {`Top molecular features associated with response to ${compound.name}`}
                                </p>
                            </h4>
                            <div className='download-button'>
                                <DownloadButton
                                    label='CSV'
                                    data={tableData}
                                    mode='csv'
                                    filename={`${compound.name} - top molecular features`}
                                />
                            </div>
                            <Table 
                                columns={COLUMNS} 
                                data={tableData} 
                                defaultSort={[{id: 'correlation', desc: true}]}
                                highlightRows={highlightRowsByCorrelation}
                            />
                        </React.Fragment>
                            :
                            <h6 align="center">No molecular feature data is available for this compound.</h6>
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
