/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import qs from 'query-string' // used to parse the query string
import { useQuery } from '@apollo/react-hooks';
import { getDatasetsQuery } from '../../queries/dataset';
import CellLineCompound from './CellLineCompound/CellLineCompound';
import TissueCompound from './TissueCompound/TissueCompound';
import NotFoundPage from '../UtilComponents/NotFoundPage';
import DatasetIntersection from './DatasetIntersection/DatasetIntersection';

/**
 * A component that evaluates, the query string and returns intersection components such as cell line vs drug and tissue vs drug.
 * The component can be rendered  with /search?cell_line=22rv1&compound=paclitaxal (Renders cell line vs drug component) 
 * @returns an intersection component (cell line vs drug or tissue vs drug page)
 */
const IntersectionMain = () => {
    const location = useLocation();
    let values = qs.parse(location.search);
    let keys = Object.keys(values);
    let pageName = undefined;

    // determined which page to be rendered. Values: 'cellDrug', 'tissueDrug', 'notFound', or undefined
    const [page, setPage] = useState({ name: undefined, query: undefined });
    const { loading, error, data: datasets } = useQuery(getDatasetsQuery);
    const [datasetParam, setDatasetParam] = useState('');

    useEffect(() => {
        let datasetParamValue = '';
        // if it's dataset intersection and only one data is queried; get the id of that dataset.
        if (keys.includes('dataset_intersection')) {
            const dataset = values['dataset_intersection'].split(',');
            if (dataset.length === 1 && !loading) {
                datasets.datasets.forEach(el => {
                    if (el.name.toUpperCase() === dataset[0].toUpperCase()) {
                        datasetParamValue = el.id;
                    }
                });
                pageName = 'individualDataset';
            } else if (dataset.length >= 2) {
                pageName = 'datasetIntersection';
            }
        } else if (keys.length >= 2 && keys.includes('compound')) { // Determines which page to render by evaluating the keys
            if (keys.includes('cell_line')) {
                pageName = 'cellCompound';
            }
            if (keys.includes('tissue')) {
                pageName = 'tissueCompound';
            }
        } else {
            pageName = 'notFound';
        }
        setPage({ name: pageName, query: values });
        setDatasetParam(datasetParamValue);
    }, [datasets]);

    return (
        loading ? '' :
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
                    page.name === 'datasetIntersection' && <DatasetIntersection datasets={page.query.dataset_intersection} isIntersection />
                }
                {
                    page.name === 'individualDataset' && <Redirect to={`/datasets/${datasetParam}`} />
                }
            </React.Fragment>
    );
}

export default IntersectionMain;