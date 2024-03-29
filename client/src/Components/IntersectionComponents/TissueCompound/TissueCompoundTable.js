import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import { StyledIntersectionSummaryTable } from '../../../styles/IntersectionComponentStyles';
import IntersectionTableCell from '../IntersectionTableCell';

const TissueCompoundTable = (props) => {
    const { data } = props;

    const columns = [
        {
            Header: `Cell Line`,
            accessor: 'cell_line.name',
            center: false, 
            Cell: (item) => <Link to={`/cell_lines/${item.cell.row.original.cell_line.id}`}>{item.value}</Link>
        },
        {
            Header: `Dataset`,
            accessor: 'dataset.name',
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
                    filename={`${data[0].compound.name}-${data[0].tissue.name}-statistics`}
                    data={data.map(item => ({
                        compound: item.compound.name,
                        tissue: item.tissue.name,
                        cell_line: item.cell_line.name,
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

export default TissueCompoundTable;