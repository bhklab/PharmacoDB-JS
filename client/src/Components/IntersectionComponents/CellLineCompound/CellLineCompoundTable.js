import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
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

    const getStyledCell = (item, statName) => {
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
                disabled={!cellData.visible}
            >
                {item.value}
            </StyledCell>
        );
    };

    const columns = [
        {
            Header: `Dataset`,
            accessor: 'dataset',
            center: true, 
            Cell: (item) => <Link to={`/datasets/${item.cell.row.original.dataset.id}`}>{item.cell.row.original.dataset.name}</Link>
        },
        {
            Header: `AAC (%)`,
            accessor: 'AAC',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'AAC')}
        },
        {
            Header: `IC50 (uM)`,
            accessor: 'IC50',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'IC50')}
        },
        {
            Header: `EC50 (uM)`,
            accessor: 'EC50',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'EC50')}
        },
        {
            Header: `Einf (%)`,
            accessor: 'Einf',
            center: true,
            Cell: (item) => {return getStyledCell(item, 'Einf')}
        },
        {
            Header: `DSS1`,
            accessor: 'DSS1',
            center: true,
        },
    ];

    return(
        <StyledIntersectionSummaryTable>
            <h3 className='title'>Summary Statistics</h3>
            <Table data={experiments.map(item => ({
                id: item.id,
                visible: item.visible,
                visibleStats: item.visibleStats,
                dataset: item.dataset,
                ...item.profile
            }))} columns={columns} disablePagination={true} />
        </StyledIntersectionSummaryTable>
        
    )
}

export default IntersectionSummaryTable;