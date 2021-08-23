import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import { StyledIntersectionSummaryTable } from '../../../styles/IntersectionComponentStyles';
import IntersectionTableCell from '../IntersectionTableCell';

const CellLineCompoundTable = (props) => {
    const { experiments, showStat, hideStat, alterClickedCells } = props;

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
                    experiments={experiments} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
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
                    experiments={experiments} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
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
                    experiments={experiments} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
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
                    experiments={experiments} 
                    showStat={showStat}
                    hideStat={hideStat}
                    alterClickedCells={alterClickedCells}
                    cellItem={item} 
                />
            )
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
                    dataset: item.dataset,
                    clicked: item.clicked,
                    ...item.profile
                }))} 
                columns={columns} 
                disablePagination={false} 
            />
            <div className='download-button'>
                <DownloadButton 
                    label='CSV' 
                    mode='csv' 
                    filename={`${experiments[0].compound.name}-${experiments[0].cell_line.name}-statistics`}
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
        
    );
}

export default CellLineCompoundTable;