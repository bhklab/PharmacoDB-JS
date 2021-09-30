/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { StyledDocPage, StyledDocSidebarList } from '../../../styles/DocumentationStyles';
import StyledWrapper from '../../../styles/utils';

import DocOverview from './Documentations/DocOverview';
import DocSearch from "./Documentations/DocSearch";
import DocDataset from './Documentations/DocDataset';
import DocTissue from './Documentations/DocTissue';
import DocCell from './Documentations/DocCell';
import DocExperiment from './Documentations/DocExperiment';
import DocGene from './Documentations/DocGene';
import DocDrug from './Documentations/DocDrug';
import DocDatasetsIntersection from './Documentations/DocDatasetsIntersection';
import DocCellVsDrug from './Documentations/DocCellVsDrug';
import DocTissueVsDrug from './Documentations/DocTissueVsDrug';
import DocBiomarker from './Documentations/DocBiomarker';

const SIDE_LINKS = [
    { label: 'Overview', name: 'overview' },
    { label: 'Search', name: 'search' },
    { label: 'Datasets', name: 'dataset' },
    { label: 'Tissues', name: 'tissue' },
    { label: 'Cell Lines', name: 'cell' },
    { label: 'Experiments', name: 'experiment' },
    { label: 'Genes', name: 'gene' },
    { label: 'Compounds', name: 'drug' },
    { label: 'Datasets Intersection', name: 'intersection' },
    { label: 'Cell line vs. Compound', name: 'cell-drug' },
    { label: 'Tissue vs. Compound', name: 'tissue-drug' },
    { label: 'Biomarker', name: 'biomarker' },
];

/**
 * Shows the description of the documentation page.
 *
 * @component
 * @example
 *
 * return (
 *   <DocDescription/>
 * )
 */
const DocDescription = () => {

    const [dataset, setDataset] = useState({
        resources: [],
        publications: [],
        datatypes: [],
        notFound: false
    });

    // A section to display on the page
    const [display, setDisplay] = useState('overview');

    /**
     *
     * @param {String} link
     */
    const createSideLink = (link, i) => (
        <li key={i} className={display === link.name ? 'selected': undefined}>
            {
                link.name=== "gap" ?
                <br/> :
                <button type='button' onClick={() => setDisplay(link.name)}>
                    {link.label}
                </button>
            }
        </li>
    );

    return (
        <StyledDocPage className="container">
            <div className='heading'>
                <span className='title'>{SIDE_LINKS.filter(item=> item.name === display)[0].label}</span>
            </div>
            <div className='wrapper'>
                <StyledDocSidebarList>
                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                </StyledDocSidebarList>
                <div className="container">
                        {
                            display === 'overview' &&
                            <Element className="section" name="overview">
                                <DocOverview />
                            </Element>
                        }
                        {
                            display === 'search' &&
                            <Element className="section" name="search">
                                <DocSearch />
                            </Element>
                        }
                        {
                            display === 'dataset' &&
                            <Element className="section" name="dataset">
                                <DocDataset />
                            </Element>
                        }
                        {
                            display === 'tissue' &&
                            <Element className="section" name="tissue">
                                <DocTissue />
                            </Element>
                        }
                        {
                            display === 'cell' &&
                            <Element className="section" name="cell">
                                <DocCell />
                            </Element>
                        }
                        {
                            display === 'experiment' &&
                            <Element className="section" name="tissue">
                                <DocExperiment />
                            </Element>
                        }
                        {
                            display === 'gene' &&
                            <Element className="section" name="tissue">
                                <DocGene />
                            </Element>
                        }
                        {
                            display === 'drug' &&
                            <Element className="section" name="drug">
                                <DocDrug />
                            </Element>
                        }
                        {
                            display === 'intersection' &&
                            <Element className="section" name="intersection">
                                <DocDatasetsIntersection />
                            </Element>
                        }
                        {
                            display === 'cell-drug' &&
                            <Element className="section" name="cell-drug">
                                <DocCellVsDrug />
                            </Element>
                        }
                        {
                            display === 'tissue-drug' &&
                            <Element className="section" name="tissue-drug">
                                <DocTissueVsDrug />
                            </Element>
                        }
                        {
                            display === 'biomarker' &&
                            <Element className="section" name="biomarker">
                                <DocBiomarker />
                            </Element>
                        }
                </div>
            </div>
        </StyledDocPage>
    );
};



export default DocDescription;

