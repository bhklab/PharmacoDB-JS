/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { getSingleTissueCompoundsQuery } from '../../../../queries/experiments';
import Loading from '../../../UtilComponents/Loading';
import Table from '../../../UtilComponents/Table/Table';

const DRUG_SUMMARY_COLUMNS = [
    {
      Header: 'Compounds',
      accessor: 'compound',
    },
    {
      Header: 'Datasets',
      accessor: 'dataset',
    },
    {
      Header: 'Experiments',
      accessor: 'experiments_number',
    },
];

/**
 * Collect data for the drug summary table
 * @param {Array} data drug summary data from the experiment API
 */
const generateTableData = (data) => {
    console.log('generateTableData');
    let tableData = { compound: [], numCompounds: 0, numDataset: 0 };
    if (data) {
        let uniqueCompounds = [...new Set(data.experiments.map(item => item.compound.id))];
        let uniqueDatasets = [...new Set(data.experiments.map(item => item.dataset.id))];
        let compounds = [];
        for(let id of uniqueCompounds){
            let experiments = data.experiments.filter(item => item.compound.id === id);
            compounds.push({
                compound: experiments[0].compound.name,
                dataset: [...new Set(experiments.map(item => item.dataset.name))].join(', '),
                experiments_number: experiments.length
            })
        }
        compounds.sort((a, b) => b.experiments_number - a.experiments_number);
        tableData.compound = compounds;
        tableData.numCompounds = uniqueCompounds.length;
        tableData.numDataset = uniqueDatasets.length;
    }
    return tableData;
};

const DrugSummaryTable = (props) => {
    const { tissue } = props;
    const { loading, error, data } = useQuery(getSingleTissueCompoundsQuery, {
        variables: { tissueId: tissue.id },
        fetchPolicy: "network-only"
    });
    const [tableData, setTableData] = useState({ compound: [], numCompounds: 0, numDataset: 0 });
    // const tableData = useMemo(() => generateTableData(data), [data]);

    useEffect(() => {
        if(!loading && data){
            setTableData(generateTableData(data));
        }
    }, [loading]);

    return(
        <React.Fragment>
            {
                loading ? <Loading />
                :
                error ? <p> Error! </p>
                :
                <React.Fragment>
                    <h4>
                        <p align="center">
                            { `Compounds tested with ${tissue.name}` }
                        </p>
                    </h4>
                    <p align="center">
                        { `${tableData.numCompounds} compounds have been tested with this tissue, using data from ${tableData.numDataset} dataset(s).` }
                    </p>
                    <Table columns={DRUG_SUMMARY_COLUMNS} data={tableData.compound} />
                </React.Fragment>
            }
        </React.Fragment>
    );
}

DrugSummaryTable.propTypes = {
    tissue: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }).isRequired,
};

export default DrugSummaryTable;