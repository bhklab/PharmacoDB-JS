/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string' // used to parse the query string
import CellLineCompound from './CellLineCompound/CellLineCompound';
import TissueCompound from './TissueCompound/TissueCompound';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import VennDiagram from '../Plots/VennDiagram';

/**
 * A component that evaluates, the query string and returns intersection components such as cell line vs drug and tissue vs drug.
 * The component can be rendered  with /search?cell_line=22rv1&compound=paclitaxal (Renders cell line vs drug component) 
 * @returns an intersection component (cell line vs drug or tissue vs drug page)
 */
const IntersectionMain = () => {
    const location = useLocation();

    // determined which page to be rendered. Values: 'cellDrug', 'tissueDrug', 'notFound', or undefined
    const [page, setPage] = useState({ name: undefined, query: undefined });

    useEffect(() => {
        let values = qs.parse(location.search);
        let keys = Object.keys(values);
        let pageName = undefined;

        // Determines which page to render by evaluating the keys
        if (keys.length >= 2 && keys.includes('compound')) {
            if (keys.includes('cell_line')) {
                pageName = 'cellCompound';
            }
            if (keys.includes('tissue')) {
                pageName = 'tissueCompound';
            }
        } else if (keys.length === 1 && keys.includes('dataset_intersection')) {
            pageName = 'vennDiagram';
        } else {
            pageName = 'notFound';
        }
        setPage({ name: pageName, query: values });
    }, []);

    return (
        <React.Fragment>
            {
                page.name === 'notFound' && <NotFoundPage />
            }
            {
                page.name === 'cellCompound' && <CellLineCompound cell_line={page.query.cell_line} compound={page.query.compound} />
            }
            {
                page.name === 'tissueCompound' && <TissueCompound tissue={page.query.tissue} compound={page.query.compound} />
            }
            {
                page.name === 'vennDiagram' && <VennDiagram datasets={page.query.dataset_intersection} />
            }
        </React.Fragment>
    );
}

export default IntersectionMain;