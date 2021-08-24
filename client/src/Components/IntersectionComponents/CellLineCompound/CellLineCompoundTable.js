import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import { StyledIntersectionSummaryTable } from '../../../styles/IntersectionComponentStyles';
import IntersectionTableCell from '../IntersectionTableCell';

const CellLineCompoundTable = (props) => {
    const { data, showStat, hideStat, alterClickedCells, isClicked } = props;

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
            Cell: (item) => (
                <IntersectionTableCell 
                    statName='AAC' 
                    value={typeof item.value === 'number' ? (item.value * 100).toFixed(3) : 'N/A'} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
                    isClicked={isClicked}
                    cellItem={item} 
                />
            )
        },
        {
            Header: `IC50 (uM)`,
            accessor: 'IC50',
            center: true,
            Cell: (item) => (
                <IntersectionTableCell 
                    statName='IC50' 
                    value={typeof item.value === 'number' ? item.value.toFixed(5) : 'N/A'} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
                    isClicked={isClicked}
                    cellItem={item} 
                />
            )
        },
        {
            Header: `EC50 (uM)`,
            accessor: 'EC50',
            center: true,
            Cell: (item) => (
                <IntersectionTableCell 
                    statName='EC50' 
                    value={typeof item.value === 'number' ? item.value.toFixed(5) : 'N/A'} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
                    isClicked={isClicked}
                    cellItem={item} 
                />
            )
        },
        {
            Header: `Einf (%)`,
            accessor: 'Einf',
            center: true,
            Cell: (item) => (
                <IntersectionTableCell 
                    statName='Einf' 
                    value={typeof item.value === 'number' ? item.value.toFixed(3) : 'N/A'}  
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
                    isClicked={isClicked}
                    cellItem={item} 
                />
            )
        }
    ];

    return(
        <StyledIntersectionSummaryTable>
            <h3 className='title'>Summary Statistics</h3>
            <Table 
                data={data} 
                columns={columns} 
                disablePagination={false} 
            />
            <div className='download-button'>
                <DownloadButton 
                    label='CSV' 
                    mode='csv' 
                    filename={`${data[0].compound}-${data[0].cellLine}-statistics`}
                    data={data.map(item => ({
                        cell_line: item.cellLine.name,
                        compound: item.compound.name,
                        dataset: item.dataset.name,
                        Einf: typeof item.Einf === 'number' ? item.Einf : '',
                        EC50: typeof item.EC50 === 'number' ? item.EC50 : '',
                        AAC: typeof item.AAC === 'number' ? item.AAC : '',
                        IC50: typeof item.IC50 === 'number' ? item.IC50 : '',
                    }))}
                />
            </div>
        </StyledIntersectionSummaryTable>
        
    );
}

export default CellLineCompoundTable;