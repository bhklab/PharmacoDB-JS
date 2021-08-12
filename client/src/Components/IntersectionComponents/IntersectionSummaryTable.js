import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../UtilComponents/Table/Table';
import styled from 'styled-components';

const StyledIntersectionSummaryTable = styled.div`
    margin-top: 50px;
    .title {
        margin-bottom: 20px;
    }
`;

const IntersectionSummaryTable = (props) => {
    const { experiments } = props;

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
            Header: `HS`,
            accessor: 'HS',
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