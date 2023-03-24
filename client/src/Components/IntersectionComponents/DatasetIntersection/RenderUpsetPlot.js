import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import StyledSelectorContainer from '../../../styles/Utils/StyledSelectorContainer';
import UpsetPlot from '../../Plots/UpsetPlot';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import styled from 'styled-components';
import getMaxWidth from '../../../utils/maxWidthOfAnElement';

// styles for the plot data table
const StyledPlotDataTable = styled.div`
    width: ${props => props.width};
    display: flex;
    flex-direction: column;
    gap: 20px;

    .download-button {
        align-self: flex-end;
    }
`; 

/**
 * 
 * @param {Array} data 
 * @returns {Array} - returns an array of objects
 */
const transformData = (data) =>  data.map(el => ({id: el, name: el}));

/**
 * create table for list of types
 */
const makeTable = (data) => {
    // an array with the columns of dataset table.
    const tableColumns = [
        {
            Header: 'Name',
            accessor: 'name',
            center: true,
            rowSpan: 2,
        },
    ];
    // table data
    const tableData = transformData(data);
    
    return <Table columns={tableColumns} data={tableData}/>
};

/**
 * main component
 */
const RenderUpsetPlot = ({ compoundData, cellData, tissueData, datasets, selectOptions }) => {
    // state to store the data and selected type.
    const [plotData, setPlotData] = useState({});
    const [selectedType, setSelectedType] = useState('Cell Line');
    const [selectedPlotData, updateSelectedPlotData] = useState();

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
        <>
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
            <UpsetPlot 
                data={plotData}    
                datasets={datasets} 
                type={selectedType} 
                updateSelectedPlotData={updateSelectedPlotData}
            />
            {
                selectedPlotData ? (
                    <StyledPlotDataTable width={getMaxWidth(window.innerWidth)}>
                        <div className='download-button'>
                            <DownloadButton
                                label='CSV'
                                data={transformData(selectedPlotData)}
                                mode='csv'
                                filename={`data`}
                            />
                        </div>
                        <div> {makeTable(selectedPlotData)} </div>
                    </StyledPlotDataTable>
                ) : <div/>
            }
        </>
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