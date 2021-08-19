import React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../UtilComponents/Table/Table';
import DownloadButton from '../../UtilComponents/DownloadButton';
import { StyledIntersectionSummaryTable } from '../../../styles/IntersectionComponentStyles';
import IntersectionTableCell from '../IntersectionTableCell';

const TissueCompoundTable = (props) => {
    const { experiments, setExperiments } = props;

    const columns = [
        {
            Header: `Cell Line`,
            accessor: 'cell_line_name',
            center: false, 
            Cell: (item) => <Link to={`/cell_lines/${item.cell.row.original.cell_line.id}`}>{item.value}</Link>
        },
        {
            Header: `Dataset`,
            accessor: 'dataset_name',
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
                    setExperiments={setExperiments} 
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
                    setExperiments={setExperiments} 
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
                    setExperiments={setExperiments} 
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
                    setExperiments={setExperiments} 
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
                    cell_line: item.cell_line,
                    cell_line_name: item.cell_line.name,
                    dataset: item.dataset,
                    dataset_name: item.dataset.name,
                    visible: item.visible,
                    visibleStats: item.visibleStats,
                    dataset: item.dataset,
                    ...item.profile
                }))} 
                columns={columns} 
                disablePagination={false} 
            />
            <div className='download-button'>
                <DownloadButton 
                    label='CSV' 
                    mode='csv' 
                    filename={`${experiments[0].compound.name}-${experiments[0].tissue.name}-statistics`}
                    data={experiments.map(item => ({
                        compound: item.compound.name,
                        tissue: item.tissue.name,
                        cell_line: item.cell_line.name,
                        dataset: item.dataset.name,
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

export default TissueCompoundTable;