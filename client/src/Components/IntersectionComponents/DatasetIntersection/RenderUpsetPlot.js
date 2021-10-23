import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';
import UpsetPlot from '../../Plots/UpsetPlot';
import createSetsWithData from './CreateSetsWithData';
import createAllSubsets from '../../../utils/createAllSubsets';

// datatype options 
const dataTypeOptions = [
    { value: 'cell', label: 'Cell Line' },
    { value: 'tissue', label: 'Tissue' },
    { value: 'compound', label: 'Compound' },
];

const RenderUpsetPlot = ({ data, cellData, datasets }) => {

    let datasetSubSets = {}, tissues_tested = {}, compounds_tested = {};

    const [plotData, setPlotData] = useState({});
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
    }, [selectedType, cellData])

    datasetSubSets = createAllSubsets(datasets);
    data.map(item => tissues_tested[item.dataset.name] = item.tissues_tested.map(t => t.name));
    data.map(item => compounds_tested[item.dataset.name] = item.compounds_tested.map(c => c.name));

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
            <UpsetPlot data={plotData || cellData} datasets={datasets} type={selectedType} />
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
