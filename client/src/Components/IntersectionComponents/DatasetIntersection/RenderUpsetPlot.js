import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';
import UpsetPlot from '../../Plots/UpsetPlot';

const RenderUpsetPlot = ({ compoundData, cellData, tissueData, datasets, selectOptions }) => {
    // state to store the data and selected type.
    const [plotData, setPlotData] = useState({});
    const [selectedType, setSelectedType] = useState('Cell Line');

    // update data based on the selected type.
    useEffect(() => {
        if (selectedType === 'Tissue') {
            return setPlotData(tissueData);
        } 
        if (selectedType === 'Compound') {
            return setPlotData(compoundData);
        } 
        if (selectedType === 'Cell Line') {
            return setPlotData(cellData);
        }
    })

    return (
        <React.Fragment>
            <StyledSelectorContainer>
                <div className='single-selector-container'>
                    <Select
                        className='selector'
                        defaultValue={{ value: selectedType, label: selectedType }}
                        options={selectOptions}
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
    })).isRequired,
    compoundData: PropTypes.objectOf(PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
        count: PropTypes.number,
    })).isRequired,
    tissueData: PropTypes.objectOf(PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
        count: PropTypes.number,
    })).isRequired,
    datasets: PropTypes.arrayOf(PropTypes.string),
    selectOptions: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
    })).isRequired,
};

export default RenderUpsetPlot;