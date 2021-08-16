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

const StyledCell = styled.div`
    cursor: pointer;
`;

const IntersectionSummaryTable = (props) => {
    const { experiments, displayedStats, setDisplayedStats } = props;

    const addStat = (id, statName) => {
        let copy = [...displayedStats];
        copy.push({id: id, statName: statName});
        setDisplayedStats(copy);
    };

    const removeStat = () => {
        let copy = [...displayedStats];
        copy = copy.filter(item => item.clicked);
        setDisplayedStats(copy);
    };

    const alterClickedCells = (id, statName) => {
        let copy = [...displayedStats];
        let index = copy.findIndex(item => item.id === id && item.statName === statName);
        if(copy[index].clicked){
            copy[index].clicked = false;
        }else{
            copy[index].clicked = true;
        }
        setDisplayedStats(copy);
    }

    const getStyledCell = (item, statName) => (
        <StyledCell 
            className={
                displayedStats.findIndex(stat => stat.id === item.cell.row.original.id && stat.statName === statName && stat.clicked) > -1 ? 'clicked' : ''
            }
            onMouseEnter={(e) => {addStat(item.cell.row.original.id, statName)}}
            onMouseOut={(e) => {removeStat()}}
            onClick={(e) => {alterClickedCells(item.cell.row.original.id, statName)}}
        >
            {item.value}
        </StyledCell>
    );

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

    const parseData = () => {
        return experiments.map(item => ({
            id: item.id,
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