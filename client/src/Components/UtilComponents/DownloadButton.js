import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import { Download } from 'react-bootstrap-icons';
import FileSaver from 'file-saver';
import Plotly from 'plotly.js-dist';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    letter-spacing: 0.5px;
    padding: 0.2rem 0.4rem 0.1rem 0.4rem;
    background-color: #ffffff;
    border: 1px solid ${colors.light_blue};
    font-size: 14px;
    color: ${colors.light_blue};
    cursor: pointer;

    .download-icon {
        margin-left: 3px;
        font-size: 14px;
    }

    :hover {
        outline: ${colors.dark_teal_heading};
        border: 1px solid ${colors.dark_teal_heading};
        color: ${colors.dark_teal_heading};
        .download-icon {
            color: ${colors.dark_teal_heading};
        }
    }
`;

const getCSVData = (data) => {
    let header = Object.keys(data[0]);
    let csv = [[...header]];
    for(let obj of data){
        let row = header.map(item => obj[item]);
        csv.push([...row]);
    }
    csv = csv.map(item => item.join(',')).join('\n');
    return csv;
}

const DownloadButton = (props) => {
    const { className, label, data, mode, filename, plotId } = props;

    const download = (e) => {
        e.preventDefault();
        switch(mode){
            case 'csv':
                let csv = getCSVData(data);
                const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                FileSaver.saveAs(csvData, `${filename}.csv`);
                break;
            case 'png':
                Plotly.downloadImage(plotId, {scale: 2, filename: filename});
                break;
            default:
                break;
        }
    }

    return (
        <StyledButton className={className} onClick={download} disabled={props.disabled} >
            {label}<Download className='download-icon'/>
        </StyledButton>
    );
}

DownloadButton.propTypes = {
    className: PropTypes.string, // class name for the button (optional)
    label: PropTypes.string.isRequired, // label for the button
    data: PropTypes.arrayOf(PropTypes.object), // data for CSV download
    mode: PropTypes.string.isRequired, // accepts 'csv' or 'png'
    filename: PropTypes.string.isRequired, 
    plotId: PropTypes.string // id of the plot to be downloaded
  };

export default DownloadButton;