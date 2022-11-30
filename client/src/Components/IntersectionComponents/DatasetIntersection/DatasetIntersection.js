import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getDatasetsQuery } from '../../../queries/dataset';
import { getTypeInformationAllDatasetsQuery } from '../../../queries/dataset';
import RenderUpsetPlot from './RenderUpsetPlot';
import createSetsWithData from './CreateSetsWithData';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import createAllSubsets from '../../../utils/createAllSubsets';
import VennDiagram from '../../Plots/VennDiagram';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';

// datatype options 
const dataTypeOptions = [
    { value: 'cell', label: 'Cell Line' },
    { value: 'tissue', label: 'Tissue' },
    { value: 'compound', label: 'Compound' },
];

/**
 *
 * @param {Object} data - data for the venn diagram.
 */
const createVennDiagramData = (data) => {
    // size object for the venn diagram.
    const size = {
        1: 16,
        2: 4,
        3: 2,
    };

    // data for the venn diagram.
    const vennData = Object.values(data).map(el => {
        return {
            sets: el.keys,
            label: String(el.values.length),
            values: el.values,
            size: size[el.keys.length],
        }
    });
    return vennData;
};

/**
 *
 * @param {Array | string} datasets - array or string of datasets.
 * @returns {Array} - an array of datasets in the upper case.
 */
const createDatasetArray = (datasets) => (
    typeof (datasets) === "string" ? datasets.split(',') : datasets
);


/**
 *
 * @param {Array} datasets
 * @param {Array} keys
 */
const createUpdatedDatasetArray = (datasets, keys) => {
    let data = [];
    if (typeof (datasets) === 'object' && datasets.length > 0) {
        const regex = new RegExp(datasets.join('|'), 'i');
        data = keys.filter(key => key.match(regex));
    } else {
        data = keys;
    }
    return data;
};

/**
 *
 * @param {boolean} loading
 * @param {boolean} datasetDataLoading
 * @param {Object} parsedCellData
 * @param {Array} updatedDatasets
 */
const renderComponent = (loading, datasetDataLoading, error, datasetDataError, parsedCellData, parsedCompoundData, parsedTissueData, updatedDatasets, data, isVenn = false) => {
    if (loading || datasetDataLoading) {
        return <Loading />
    }

    if (error || datasetDataError) {
        return <Error />
    }

    if (isVenn) {
        return (
            <>
                <h2>Overlaps among datasets</h2>
                <VennDiagram 
                    tissueData={createVennDiagramData(parsedTissueData)} 
                    compoundData={createVennDiagramData(parsedCompoundData)}
                    cellData={createVennDiagramData(parsedCellData)}
                    selectOptions={dataTypeOptions}
                />
            </>
        )
    } else {
        return (
            <>
                <h2>Overlaps among datasets</h2>
                <RenderUpsetPlot
                    compoundData={parsedCompoundData}
                    tissueData={parsedTissueData}
                    cellData={parsedCellData}
                    datasets={updatedDatasets}
                    selectOptions={dataTypeOptions}
                />
            </>
        )
    }
};


/**
 * Parses data from the cell line query for the upset plot.
 * @component
 */
const DatasetIntersection = ({ datasets: datasetProp = [], isIntersection = false }) => {

    // array of the datasets from the prop.
    const datasetsPropArray = createDatasetArray(datasetProp);

    // cell line and dataset data from the APIs.
    const { loading, error, data } = useQuery(getTypeInformationAllDatasetsQuery);

    const { loading: datasetDataLoading, error: datasetDataError, data: datasetData } = useQuery(getDatasetsQuery);

    // setting the state to grab the updated dataset array and cell line data.
    const [updatedDatasets, setDatasets] = useState([]);
    const [parsedCellData, setParsedCellData] = useState({});
    const [parsedCompoundData, setParsedCompoundData] = useState({});
    const [parsedTissueData, setParsedTissueData] = useState({});
    const [isVenn, setIsVenn] = useState(false);
    const [plotData, setPlotData] = useState([]);

    useEffect(() => {
        if (data && datasetData) {

            // array of the datasets from the database.
            const datasets = datasetData.datasets.map(dataset => dataset.name);

            // cell data object.
            const cells = {}, tissues = {}, compounds = {};
            data.datatypes_information_all_datasets.forEach(el => cells[el.dataset.name] = el.cells_tested.map(cell => cell.name));
            data.datatypes_information_all_datasets.forEach(el => tissues[el.dataset.name] = el.tissues_tested.map(tissue => tissue.name));
            data.datatypes_information_all_datasets.forEach(el => compounds[el.dataset.name] = el.compounds_tested.map(compound => compound.name));

            // update the dataset names according to the names in the database.
            const updatedDatasetArray = createUpdatedDatasetArray(datasetsPropArray, datasets);

            // all the subsets of the dataset array and upset plot data for cell lines.
            const datasetSubSets = createAllSubsets(updatedDatasetArray);

            // dataset subsets with cell data, tissue data and compound data.
            const subSetCells = createSetsWithData(cells, datasetSubSets);
            const subSetTissues = createSetsWithData(tissues, datasetSubSets);
            const subSetCompounds = createSetsWithData(compounds, datasetSubSets);

            // update the state to include a dataset list and
            setDatasets(updatedDatasetArray);
            setParsedCellData(subSetCells);
            setParsedCompoundData(subSetCompounds);
            setParsedTissueData(subSetTissues);
            setPlotData(data.datasets_types);

            // set the state of isVenn to true if the dataset prop length is 3 or less than 3.
            if (datasetsPropArray.length <= 3) {
                setIsVenn(true);
            }
        }
    }, [data, datasetData])

    return (
        isIntersection
            ? (
                <Layout page="dataset_intersection">
                    <StyledWrapper>
                        {
                            renderComponent(loading, datasetDataLoading, error, datasetDataError, parsedCellData, parsedCompoundData, parsedTissueData, updatedDatasets, plotData, isVenn)
                        }
                    </StyledWrapper>
                </Layout>
            )
            : (
                <>
                    {
                        renderComponent(loading, datasetDataLoading, error, datasetDataError, parsedCellData, parsedCompoundData, parsedTissueData, updatedDatasets, plotData)
                    }
                </>
            )
    )
};


DatasetIntersection.propTypes = {
    datasets: PropTypes.string,
    isIntersection: PropTypes.bool,
}

export default DatasetIntersection;