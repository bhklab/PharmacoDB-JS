import React from 'react';
import { StyledCell } from '../../styles/IntersectionComponentStyles';

const IntersectionTableCell = (props) => {
    const { statName, value, showStat, hideStat, alterClickedCells, cellItem } = props;
    const cellData = cellItem.cell.row.original;

    return(
        <StyledCell 
            className={ cellData.clicked[statName] ? 'clicked' : '' }
            onMouseEnter={(e) => {
                showStat(cellData.id, statName, true);
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
}

export default IntersectionTableCell;