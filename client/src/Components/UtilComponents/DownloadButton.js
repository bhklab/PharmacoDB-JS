import React from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import { Download } from 'react-bootstrap-icons';
import FileSaver from 'file-saver';
import Plotly from 'plotly.js-dist';
import PropTypes from 'prop-types';

/**
 * Button used to download plot in .svg or .png format,
 * or table data in .csv format.
 * The implementation examples can be found in the files in IndivDatasets/Tables,
 * and Plots/DatasetHorizontalPlot.js
 */

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    letter-spacing: 0.5px;
    padding: 0.2rem 0.4rem 0.1rem 0.4rem;
    background-color: #ffffff;
    border: 1px solid ${colors.light_blue};
    font-size: clamp(12px, calc(1vw + 1px), 14px);
    color: ${colors.light_blue};
    cursor: pointer;

    .download-icon {
        margin-left: 3px;
        font-size: clamp(12px, calc(1vw + 1px), 14px);
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
        let row = header.map(item => `"${obj[item]}"`);
        csv.push([...row]);
    }
    csv = csv.map(item => item.join(',')).join('\n');
    return csv;
}

const DownloadButton = (props) => {
    /**
     * Props
     * className: Optional. String. Used to add additional style to the button.
     * label: Required. String. Button label to be displayed.
     * mode: Required. String. Accepts 'csv', 'svg', or 'png'. Used to determine the download mode.
     * filename: Required. String. Filename of the downloaded file.
     * data: Required for CSV file download. An array of objects, each representing a row in the CSV file.
     * plotId: Required for plot download. String. HTML id for the plot to be downloaded. A plot needs to be given an id so that the download button can identify it.
     */
    const { className, label, mode, filename, data, plotId } = props;

    const download = (e) => {
        e.preventDefault();
        switch(mode){
            case 'csv':
                let csv = getCSVData(data);
                const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                FileSaver.saveAs(csvData, `${filename}.csv`);
                break;
            case 'png':
                Plotly.downloadImage(plotId, {format: 'png', scale: 7, filename: filename});
                break;
            case 'svg':
                Plotly.downloadImage(plotId, {format: 'svg', scale: 2, filename: filename});
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
    mode: PropTypes.string.isRequired, // accepts 'csv', 'png' or 'svg'
    filename: PropTypes.string.isRequired, // downloaded filename
    plotId: PropTypes.string // id of the plot to be downloaded. Used for downloading a plot.
};

export default DownloadButton;
