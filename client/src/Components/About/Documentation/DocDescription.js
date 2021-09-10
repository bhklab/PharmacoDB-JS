/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

import Overview from './Documentations/DocOverview';
import Search from "./Documentations/DocSearch";
import Dataset from './Documentations/DocDataset';
import Tissue from './Documentations/DocTissue';
import Cell from './Documentations/DocCell';
import Experiment from './Documentations/DocExperiment';
import Gene from './Documentations/DocGene';
import Drug from './Documentations/DocDrug';
import DatasetsIntersection from './Documentations/DocDatasetsIntersection';
import CellVsDrug from './Documentations/DocCellVsDrug';
import TissueVsDrug from './Documentations/DocTissueVsDrug';
import API from './Documentations/DocAPI';
import Biomarker from './Documentations/DocBiomarker';

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
    { label: 'Cell line vs. Drug', name: 'cell-drug' },
    { label: 'Tissue vs. Drug', name: 'tissue-drug' },
    { label: 'API', name: 'api' },
    { label: 'Biomarker', name: 'biomarker' },
];

/**
 * Parent component for the individual compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivDatasets/>
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
        <StyledIndivPage className="documentation">
            <div className='wrapper'>
                <StyledSidebarList>
                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                </StyledSidebarList>
                <div className="container">
                    <div className="content">
                        {
                            display === 'overview' &&
                            <Element className="section" name="overview">
                                <h1 className='section-title'>Overview</h1>
                                <Overview />
                            </Element>
                        }
                        {
                            display === 'search' &&
                            <Element className="section" name="search">
                                <div className='section-title'>Search</div>
                                <Search />
                            </Element>
                        }
                        {
                            display === 'dataset' &&
                            <Element className="section" name="dataset">
                                <div className='section-title'>Datasets</div>
                                <Dataset />
                            </Element>
                        }
                        {
                            display === 'tissue' &&
                            <Element className="section" name="tissue">
                                <div className='section-title'>Tissues</div>
                                <Tissue />
                            </Element>
                        }
                        {
                            display === 'cell' &&
                            <Element className="section" name="cell">
                                <div className='section-title'>Cell Lines</div>
                                <Cell />
                            </Element>
                        }
                        {
                            display === 'experiment' &&
                            <Element className="section" name="tissue">
                                <div className='section-title'>Experiments</div>
                                <Experiment />
                            </Element>
                        }
                        {
                            display === 'gene' &&
                            <Element className="section" name="tissue">
                                <StyledIndivPage className="title">Genes</StyledIndivPage>
                                <Gene />
                            </Element>
                        }
                        {
                            display === 'drug' &&
                            <Element className="section" name="drug">
                                <div className='section-title'>Compounds</div>
                                <Drug />
                            </Element>
                        }
                        {
                            display === 'intersection' &&
                            <Element className="section" name="intersection">
                                <div className='section-title'>Datasets Intersection</div>
                                <DatasetsIntersection />
                            </Element>
                        }
                        {
                            display === 'cell-drug' &&
                            <Element className="section" name="cell-drug">
                                <div className='section-title'>Cell line vs. Drug</div>
                                <CellVsDrug />
                            </Element>
                        }
                        {
                            display === 'tissue-drug' &&
                            <Element className="section" name="tissue-drug">
                                <div className='section-title'>Tissue vs. Drug</div>
                                <TissueVsDrug />
                            </Element>
                        }
                        {
                            display === 'api' &&
                            <Element className="section" name="api">
                                <div className='section-title'>API</div>
                                <API />
                            </Element>
                        }
                        {
                            display === 'biomarker' &&
                            <Element className="section" name="biomarker">
                                <div className='section-title'>Biomarker</div>
                                <Biomarker />
                            </Element>
                        }
                    </div>
                </div>
            </div>
        </StyledIndivPage>
    );
};



export default DocDescription;

