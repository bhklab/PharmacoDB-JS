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
      Cell: (item) => <a href={`/compounds/${item.cell.row.original.id}`}>{item.value}</a>
    },
    {
      Header: 'Datasets',
      accessor: 'dataset',
      Cell: (item) => {
          let datasets = item.cell.row.original.datasetObj;
          return(datasets.map((obj, i) => (
            <span key={i}>
                <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
            </span>
          )
        ));
      }
    },
    {
      Header: 'Experiments',
      accessor: 'num_experiments',
    },
];

/**
 * Collect data for the drug summary table
 * @param {Array} data drug summary data from the experiment API
 */
const generateTableData = (data) => {
    let tableData = { ready: false, compound: [], numCompounds: 0, numDataset: 0 };
    if (data) {
        let uniqueCompounds = [...new Set(data.map(item => item.compound.id))];
        let uniqueDatasets = [...new Set(data.map(item => item.dataset.id))];
        let compounds = [];
        for(let id of uniqueCompounds){
            let experiments = data.filter(item => item.compound.id === id);
            
            let datasets = experiments.map(item => item.dataset);
            let datasetIds = [...new Set(datasets.map(item => item.id))];
            let datasetObj = [];
            for(let id of datasetIds){
                let found = datasets.find(item => item.id === id);
                datasetObj.push(found);
            }
            datasetObj.sort((a, b) => a - b);

            compounds.push({
                compound: experiments[0].compound.name,
                dataset: datasetObj.map(item => item.name).join(', '),
                num_experiments: experiments.length,
                id: experiments[0].compound.id,
                datasetObj: datasetObj
            })
        }
        compounds.sort((a, b) => b.num_experiments - a.num_experiments);
        tableData.compound = compounds;
        tableData.numCompounds = uniqueCompounds.length;
        tableData.numDataset = uniqueDatasets.length;
        tableData.ready = true;
    }
    return tableData;
};

const DrugSummaryTable = (props) => {
    const { tissue } = props;
    const [tableData, setTableData] = useState({ ready: false, compound: [], numCompounds: 0, numDataset: 0 });
    const [error, setError] = useState(false);

    const { loading } = useQuery(getSingleTissueCompoundsQuery, {
        variables: { tissueId: tissue.id },
        // fetchPolicy: "network-only",
        onCompleted: (data) => {
            console.log(data);
            setTableData(generateTableData(data.experiments));
        },
        onError: (err) => {
            setError(true);
        }
    });

    return(
        <React.Fragment>
            {
                error && <p> Error! </p>
            }
            {
                loading || !tableData.ready ? <Loading />
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