import React from 'react';
import { StyledCell } from '../../styles/IntersectionComponentStyles';

const IntersectionTableCell = (props) => {
    const { statName, value, experiments, setExperiments, cellItem } = props;
    const cellData = cellItem.cell.row.original;

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
    };

    const alterClickedCells = (id, statName) => {
        let copy = JSON.parse(JSON.stringify(experiments));
        let index = copy.findIndex(item => item.id === id);
        copy[index].visibleStats[statName].clicked = !copy[index].visibleStats[statName].clicked;
            copy[index].clicked = false;
        setExperiments(copy);
    };

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
}

export default IntersectionTableCell;