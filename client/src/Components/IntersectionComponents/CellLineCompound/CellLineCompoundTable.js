import React, { useState } from 'react';
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

const StyledCell = styled.div`
    cursor: pointer;
`;

const IntersectionSummaryTable = (props) => {
    const { experiments, displayedStats, setDisplayedStats } = props;

    const addStat = (rowName, statName) => {
        let copy = [...displayedStats];
        copy.push({rowName: rowName, statName: statName});
        setDisplayedStats(copy);
    };

    const removeStat = () => {
        let copy = [...displayedStats];
        copy = copy.filter(item => item.clicked);
        setDisplayedStats(copy);
    };

    const alterClickedCells = (rowName, statName) => {
        let copy = [...displayedStats];
        let index = copy.findIndex(item => item.rowName === rowName && item.statName === statName);
        if(copy[index].clicked){
            copy[index].clicked = false;
        }else{
            copy[index].clicked = true;
        }
        setDisplayedStats(copy);
    }

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
            Cell: (item) => (
                <StyledCell 
                    className={
                        displayedStats.findIndex(stat => stat.rowName === item.cell.row.original.dataset.name && stat.statName === 'AAC' && stat.clicked) > -1 ? 'clicked' : ''
                    }
                    onMouseEnter={(e) => {addStat(item.cell.row.original.dataset.name, 'AAC')}}
                    onMouseOut={(e) => {removeStat()}}
                    onClick={(e) => {alterClickedCells(item.cell.row.original.dataset.name, 'AAC')}}
                >
                    {item.value}
                </StyledCell>
            )
        },
        {
            Header: `IC50 (uM)`,
            accessor: 'IC50',
            center: true,
        },
        {
            Header: `EC50 (uM)`,
            accessor: 'EC50',
            center: true,
        },
        {
            Header: `Einf (%)`,
            accessor: 'Einf',
            center: true,
        },
        {
            Header: `DSS1`,
            accessor: 'DSS1',
            center: true,
        },
    ];

    const parseData = () => {
        return experiments.map(item => ({
            dataset: item.dataset,
            ...item.profile
        }));
    }

    return(
        <StyledIntersectionSummaryTable>
            <h3 className='title'>Summary Statistics</h3>
            <Table data={parseData()} columns={columns} disablePagination={true} />
        </StyledIntersectionSummaryTable>
        
    )
}

export default IntersectionSummaryTable;