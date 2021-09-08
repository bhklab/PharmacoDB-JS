import React, { useContext } from 'react';
import { StyledCell } from '../../styles/IntersectionComponentStyles';
import PageContext from '../../context/PageContext';

const IntersectionTableCell = (props) => {
    const { statName, value, cellItem } = props;
    const cellData = cellItem.cell.row.original;
    const page = useContext(PageContext);

    return(
        <StyledCell 
            className={ page.isClicked(cellData.id, statName) ? 'clicked' : '' }
            onMouseEnter={(e) => {
                e.preventDefault();
                page.showStat(cellData.id, statName, true);
            }}
            onMouseOut={(e) => {
                e.preventDefault();
                page.hideStat();
            }}
            onClick={(e) => {
                e.preventDefault();
                page.alterClickedCells(cellData.id, statName);
            }}
            disabled={page.isDisabled(cellData.id) || value === 'N/A'}
        >
            {value}
        </StyledCell>
    );
}

export default IntersectionTableCell;