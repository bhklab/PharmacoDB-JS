import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import styled from 'styled-components';
import colors from '../../../styles/colors'

const StyledIntersectionSummaryTable = styled.div`
    margin-top: 50px;
    .title {
        margin-bottom: 20px;
    }
    tbody {
        td {
            :hover {
                background-color: ${colors.light_teal};
            }
        }
    }
    .clicked {
        color: ${colors.dark_pink_highlight};
    }
    .download-button {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        margin-bottom: 30px;
    }
`;

const StyledCell = styled.button`
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: none;
    background: none;
    color: ${colors.dark_gray_text};
    :disabled {
        color: #dddddd;
        cursor: default;
    }
`;

const IntersectionSummaryTable = (props) => {
    const { experiments, setExperiments } = props;

    const displayStat = (id, statName) => {
        let copy = JSON.parse(JSON.stringify(experiments));
        let index = copy.findIndex(item => item.id === id);
        copy[index].visibleStats[statName].visible = true;
        setExperiments(copy);
    };

    const hideStat = () => {
        let copy = JSON.parse(JSON.stringify(experiments));
        for(const exp of copy){
            exp.visibleStats.AAC.visible = exp.visibleStats.AAC.clicked ? true : false;
            exp.visibleStats.IC50.visible = exp.visibleStats.IC50.clicked ? true : false;
            exp.visibleStats.EC50.visible = exp.visibleStats.EC50.clicked ? true : false;
            exp.visibleStats.Einf.visible = exp.visibleStats.Einf.clicked ? true : false;
            exp.visibleStats.DSS1.visible = exp.visibleStats.DSS1.clicked ? true : false;
        }
        setExperiments(copy);
    }

    const alterClickedCells = (id, statName) => {
        let copy = JSON.parse(JSON.stringify(experiments));
        let index = copy.findIndex(item => item.id === id);
        copy[index].visibleStats[statName].clicked = !copy[index].visibleStats[statName].clicked;
            copy[index].clicked = false;
        setExperiments(copy);
    }

    const getStyledCell = (item, statName, value) => {
        let cellData = item.cell.row.original;
        return(
            <StyledCell 
                className={ cellData.visibleStats[statName].clicked ? 'clicked' : '' }
                onMouseEnter={(e) => {
                    displayStat(cellData.id, statName);
                }}
                onMouseOut={(e) => {
                    hideStat();
                }}
                onClick={(e) => {
                    alterClickedCells(cellData.id, statName);
                }}
                disabled={!cellData.visible || value === 'N/A'}
            >
                {value}
            </StyledCell>
        );
    };

    const columns = [
        {
            Header: `Dataset`,
            accessor: 'name',
            center: false, 
            Cell: (item) => <Link to={`/datasets/${item.cell.row.original.dataset.id}`}>{item.value}</Link>
        },
        {
            Header: `AAC (%)`,
            accessor: 'AAC',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'AAC', typeof item.value === 'number' ? (item.value * 100).toFixed(3) : 'N/A')}
        },
        {
            Header: `IC50 (uM)`,
            accessor: 'IC50',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'IC50', typeof item.value === 'number' ? item.value.toFixed(5) : 'N/A')}
        },
        {
            Header: `EC50 (uM)`,
            accessor: 'EC50',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'EC50', typeof item.value === 'number' ? item.value.toFixed(5) : 'N/A')}
        },
        {
            Header: `Einf (%)`,
            accessor: 'Einf',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'Einf', typeof item.value === 'number' ? item.value.toFixed(3) : 'N/A')}
        }
    ];

    return(
        <StyledIntersectionSummaryTable>
            <h3 className='title'>Summary Statistics</h3>
            <Table 
                data={experiments.map(item => ({
                    id: item.id,
                    name: item.name,
                    visible: item.visible,
                    visibleStats: item.visibleStats,
                    dataset: item.dataset,
                    ...item.profile
                }))} 
                columns={columns} 
                disablePagination={true} 
            />
            <div className='download-button'>
                <DownloadButton 
                    label='CSV' 
                    mode='csv' 
                    filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}`}
                    data={experiments.map(item => ({
                        cell_line: item.cell_line.name,
                        compound: item.compound.name,
                        dataset: item.name,
                        Einf: typeof item.profile.Einf === 'number' ? item.profile.Einf : '',
                        EC50: typeof item.profile.EC50 === 'number' ? item.profile.EC50 : '',
                        AAC: typeof item.profile.AAC === 'number' ? item.profile.AAC : '',
                        IC50: typeof item.profile.IC50 === 'number' ? item.profile.IC50 : '',
                    }))}
                />
            </div>
        </StyledIntersectionSummaryTable>
        
    )
}

export default IntersectionSummaryTable;