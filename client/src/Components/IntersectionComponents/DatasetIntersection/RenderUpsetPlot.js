import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';
import UpsetPlot from '../../Plots/UpsetPlot';

// datatype options 
const dataTypeOptions = [
    { value: 'cell', label: 'Cell Line' },
    { value: 'tissue', label: 'Tissue' },
    { value: 'compound', label: 'Compound' },
];

const RenderUpsetPlot = ({ compoundData, cellData, tissueData, datasets }) => {
    // state to store the data and selected type.
    const [plotData, setPlotData] = useState({});
    const [selectedType, setSelectedType] = useState('Cell line');

    // update data based on the selected type.
    useEffect(() => {
        if (selectedType === 'Tissue') {
            setPlotData(tissueData);
        } else if (selectedType === 'Compound') {
            setPlotData(compoundData);
        }
        else {
            setPlotData(cellData);
        }
    })

    return (
        <React.Fragment>
            <StyledSelectorContainer>
                <div className='single-selector-container'>
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
    compoundData: PropTypes.objectOf(PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
        count: PropTypes.number,
    })),
    tissueData: PropTypes.objectOf(PropTypes.shape({
        keys: PropTypes.arrayOf(PropTypes.string),
        values: PropTypes.arrayOf(PropTypes.string),
        count: PropTypes.number,
    })),
    datasets: PropTypes.arrayOf(PropTypes.string),
};

export default RenderUpsetPlot;
