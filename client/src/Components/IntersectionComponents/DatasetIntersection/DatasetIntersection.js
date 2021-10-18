import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLinesQuery } from '../../../queries/cell';
import { getDatasetsTypesQuery } from '../../../queries/dataset';
import { getDatasetsQuery } from '../../../queries/dataset';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import createAllSubsets from '../../../utils/createAllSubsets';
import UpsetPlot from '../../Plots/UpsetPlot';
import VennDiagram from '../../Plots/VennDiagram';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import Select from 'react-select';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';

/**
 * Parses the data and prepare an object for each dataset and all the related types in the dataset.
 * @param {Array} data - input data that has to be parsed.
 */
const parseCellLineData = (data) => {
    // object to store the final result.
    let dataObject = {};
    // iterate through the data to prepare the data Object.
    data.forEach((element) => {
        element.dataset.forEach(dataset => {
            if (!dataObject[dataset.name]) {
                dataObject[dataset.name] = [element.name]
            } else if (dataObject[dataset.name]) {
                dataObject[dataset.name].push(element.name);
            }
        })
    });
    // this is set each key to unique list of data type.
    Object.keys(dataObject).forEach((key) => {
        dataObject[key] = [...new Set(dataObject[key])]
    })
    return dataObject;
};

/**
 *
 * @param {Object} data - input data.
 * @param {Array} subsets - list of all the subsets.
 */
const createUpsetPlotData = (data, subsets) => {
    const finalObject = {};
    subsets.forEach((subset, i) => {
        if (subset.length > 0) {
            // union of the data.
            // subset.forEach(el => uniqueValues.push(...data[el]));

            // intersection
            let result = [];
            if (subset.length === 1) {
                result = data[subset[0]];
            } else {
                result = subset.reduce((acc, cur) => {
                    if (typeof (acc) === "string") {
                        return data[acc].filter((el) => data[cur].includes(el));
                    } else {
                        return acc.filter((el) => data[cur].includes(el));
                    }
                });
            }

            // append the object to final object variable.
            finalObject[`set${i}`] = {
                keys: subset,
                values: [...new Set(result)],
                count: result.length,
            }
        }
    })
    return finalObject;
};

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

const DrawUpsetPlot = (props) => {
    const {
        data, datasets
    } = props;

    let datasetSubSets = {}, tissues_tested = {}, cells_tested = {}, compounds_tested = {};

    const [plotData, setPlotData] = useState(props.data);
    useEffect(() => { setPlotData(data) }, [data])

    const [selectedType, setSelectedType] = useState('Cell line');
    useEffect(() => {
        if (selectedType === "Tissue") {
            setPlotData(createUpsetPlotData(tissues_tested, datasetSubSets))
        } else if (selectedType === "Compound") {
            setPlotData(createUpsetPlotData(compounds_tested, datasetSubSets))
        }
        else {
            setPlotData(props.data)
        }
    }, [selectedType])
    const dataTypeOptions = [
        { value: 'cell', label: 'Cell Line' },
        { value: 'tissue', label: 'Tissue' },
        { value: 'compound', label: 'Compound' },
    ]

    const { loading: typesLoading, error: typesError, data: types } = useQuery(getDatasetsTypesQuery);
    if (!typesLoading) {
        const datasets = types.datasets_types.map(item => item.dataset.name);
        datasetSubSets = createAllSubsets(datasets);
        types.datasets_types.map(item => tissues_tested[item.dataset.name] = item.tissues_tested.map(t => t.name));
        // types.datasets_types.map(item => cells_tested[item.dataset.name]= item.cells_tested);
        types.datasets_types.map(item => compounds_tested[item.dataset.name] = item.compounds_tested.map(c => c.name));
    }

    return (
        <React.Fragment>
            <StyledSelectorContainer>
                <div className="single-selector-container">
                    {/* <div className='label'>Type:</div> */}
                    <Select
                        className='selector'
                        defaultValue={{ value: selectedType, label: selectedType }}
                        options={dataTypeOptions}
                        onChange={(e) => setSelectedType(e.label)}
                    />
                </div>
            </StyledSelectorContainer>
            <UpsetPlot data={plotData} datasets={props.datasets} type={selectedType} />
        </React.Fragment>
    );
};

/**
 *
 * @param {boolean} cellDataLoading
 * @param {boolean} datasetDataLoading
 * @param {Object} parsedCellData
 * @param {Array} updatedDatasets
 */
const renderComponent = (cellDataLoading, datasetDataLoading, cellDataError, datasetDataError, parsedCellData, updatedDatasets, isVenn = false) => {
    const datasetString = updatedDatasets.join(' + ');

    if (cellDataLoading || datasetDataLoading) {
        return <Loading />
    }

    if (cellDataError || datasetDataError) {
        return <Error />
    }

    if (isVenn) {
        return (
            <>
                <h2>Overlaps among datasets</h2>
                <VennDiagram data={createVennDiagramData(parsedCellData)} />
            </>
        )
    } else {
        return (
            <>
                <h2>Overlaps among datasets</h2>
                <DrawUpsetPlot data={parsedCellData} datasets={updatedDatasets} />
            </>
        )
    }
};


/**
 * Parses data from the cell line query for the upset plot.
 * @component
 */
const DatasetIntersection = ({ datasets: datasetsProp = [], isIntersection = false }) => {
    // array of the datasets from the prop.
    const datasetsPropArray = createDatasetArray(datasetsProp);

    // cell line and dataset data from the APIs.
    const { loading: cellDataLoading, error: cellDataError, data: cellLineData } = useQuery(getCellLinesQuery);
    const { loading: datasetDataLoading, error: datasetDataError, data: datasetData } = useQuery(getDatasetsQuery);

    // setting the state to grab the updated dataset array and cell line data.
    const [updatedDatasets, setDatasets] = useState([]);
    const [parsedCellData, setParsedCellData] = useState({});
    const [isVenn, setIsVenn] = useState(false);

    useEffect(() => {
        if (cellLineData && datasetData) {
            // array of the datasets from the database and parsed cell line data.
            const datasets = datasetData.datasets.map(dataset => dataset.name);
            const parsedCells = parseCellLineData(cellLineData.cell_lines);

            // update the dataset names according to the names in the database.
            const updatedDatasetArray = createUpdatedDatasetArray(datasetsPropArray, datasets);

            // all the subsets of the dataset array and upset plot data for cell lines.
            const datasetSubSets = createAllSubsets(updatedDatasetArray);
            const subSetCells = createUpsetPlotData(parsedCells, datasetSubSets);

            // update the state to include a dataset list and
            setDatasets(updatedDatasetArray);
            setParsedCellData(subSetCells);

            // set the state of isVenn to true if the dataset prop length is 3 or less than 3.
            if (datasetsPropArray.length <= 3) {
                setIsVenn(true);
            }
        }
    }, [cellLineData, datasetData])

    return (
        isIntersection
            ? (
                <Layout page="dataset_intersection">
                    <StyledWrapper>
                        {
                            renderComponent(cellDataLoading, datasetDataLoading, cellDataError, datasetDataError, parsedCellData, updatedDatasets, isVenn)
                        }
                    </StyledWrapper>
                </Layout>
            )
            : (
                <>
                    {
                        renderComponent(cellDataLoading, datasetDataLoading, cellDataError, datasetDataError, parsedCellData, updatedDatasets)
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
