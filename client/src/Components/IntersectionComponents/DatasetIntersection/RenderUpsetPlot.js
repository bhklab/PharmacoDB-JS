import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useQuery } from '@apollo/react-hooks';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';
import { getDatasetsTypesQuery } from '../../../queries/dataset';
import UpsetPlot from '../../Plots/UpsetPlot';
import createSetsWithData from './CreateSetsWithData';
import createAllSubsets from '../../../utils/createAllSubsets';

// datatype options 
const dataTypeOptions = [
    { value: 'cell', label: 'Cell Line' },
    { value: 'tissue', label: 'Tissue' },
    { value: 'compound', label: 'Compound' },
];

const RenderUpsetPlot = ({ cellData, datasets }) => {

    let datasetSubSets = {}, tissues_tested = {}, cells_tested = {}, compounds_tested = {};

    const [plotData, setPlotData] = useState(cellData);
    useEffect(() => { setPlotData(cellData) }, [cellData])

    const [selectedType, setSelectedType] = useState('Cell line');
    useEffect(() => {
        if (selectedType === "Tissue") {
            setPlotData(createSetsWithData(tissues_tested, datasetSubSets))
        } else if (selectedType === "Compound") {
            setPlotData(createSetsWithData(compounds_tested, datasetSubSets))
        }
        else {
            setPlotData(cellData)
        }
    }, [selectedType])


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
            <UpsetPlot data={plotData} datasets={datasets} type={selectedType} />
        </React.Fragment>
    );
};

RenderUpsetPlot.propTypes = {
    cellData: PropTypes.objectOf(PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
        count: PropTypes.number,
    })),
    datasets: PropTypes.arrayOf(PropTypes.string),
};

export default RenderUpsetPlot;
