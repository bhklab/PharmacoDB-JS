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
import Cell from './Documentations/DocCell';
import Tissue from './Documentations/DocTissue';
import Drug from './Documentations/DocDrug';
import Dataset from './Documentations/DocDataset';
import DatasetsIntersection from './Documentations/DocDatasetsIntersection';
import CellVsDrug from './Documentations/DocCellVsDrug';
import TissueVsDrug from './Documentations/DocTissueVsDrug';

const SIDE_LINKS = [
    { label: 'Overview', name: 'overview' },
    { label: 'break', name: 'gap' },
    { label: 'Search', name: 'search' },
    { label: 'break', name: 'gap' },
    { label: 'Cell Lines', name: 'cell' },
    { label: 'Tissues', name: 'tissue' },
    { label: 'Drugs', name: 'drug' },
    { label: 'Dataset', name: 'dataset' },
    { label: 'Datasets Intersection', name: 'intersection' },
    { label: 'Cell line vs. Drug', name: 'cell-drug' },
    { label: 'Tissue vs. Drug', name: 'tissue-drug' },
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
    const [display, setDisplay] = useState('info');

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
            <div className='heading'>
                <span className='title'>{dataset.name}</span>
            </div>
            <div className='wrapper'>
                <StyledSidebarList>
                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                </StyledSidebarList>
                <div className="container">
                    <div className="content">
                        {
                            display === 'overview' &&
                            <Element className="section" name="overview">
                                <div className='section-title'>Overview</div>
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
                            display === 'cell' &&
                            <Element className="section" name="cell">
                                <div className='section-title'>Cell Lines</div>
                                <Cell />
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
                            display === 'drug' &&
                            <Element className="section" name="drug">
                                <div className='section-title'>Drugs</div>
                                <Drug />
                            </Element>
                        }
                        {
                            display === 'dataset' &&
                            <Element className="section" name="dataset">
                                <div className='section-title'>Dataset</div>
                                <Dataset />
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
                    </div>
                </div>
            </div>
        </StyledIndivPage>
    );
};



export default DocDescription;

// import React, { useState }  from 'react';
// import styled from 'styled-components';
// import './Documentation.css';
// import colors from '../../../styles/colors';
//
// import Overview from './Documentations/DocOverview';
// import Search from "./Documentations/DocSearch";
// import Cell from './Documentations/DocCell';
// import Tissue from './Documentations/DocTissue';
// import Drug from './Documentations/DocDrug';
// import Dataset from './Documentations/DocDataset';
// import DatasetsIntersection from './Documentations/DocDatasetsIntersection';
// import CellVsDrug from './Documentations/DocCellVsDrug';
// import TissueVsDrug from './Documentations/DocTissueVsDrug';
//
//
// const StyledDescription = styled.div`
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//
//     width: 70%;
//     margin-top: 8vh;
//
//     .text-container {
//         width: 100%;
//
//         display: flex;
//         flex-direction: column;
//
//         span {
//             font-size: calc(0.5vw + 0.7em);
//             line-height: calc(1vw + 1em);
//         }
//
//         h1 {
//             color: ${colors.dark_teal_heading};
//             font-family: 'Roboto Slab', serif;
//             font-size: calc(1.8vw + 1em) !important;
//             margin-bottom: 4vh;
//         }
//     }
//
//     /* mobile */
//     @media only screen and (max-width: 1081px) {
//         .text-container{
//           width:100%;
//         }
//     }
// `;
//
// /**
//  * Shows the description on documentation page
//  *
//  * @component
//  * @example
//  *
//  * return (
//  *   <DocDescription/>
//  * )
//  */
// const DocDescription = () => {
//     const [display, setDisplay] = useState('overview');
//     return (
//         <StyledDescription>
//             <div className='pageContent'>
//                 <div className='documentationContent'>
//                     <nav className='documentationNav'>
//                         <ul>
//                             <li className={display === 'overview' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'overview' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('overview')}>
//                                     Overview
//                                 </button>
//                             </li>
//                         </ul>
//                         <ul>
//                             <li className={display === 'search' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'search' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('search')}>
//                                     Search
//                                 </button>
//                             </li>
//                         </ul>
//                         <ul>
//                             <li className={display === 'cell' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'cell' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('cell')}>
//                                     Cell lines
//                                 </button>
//                             </li>
//                             <li className={display === 'tissue' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'tissue' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('tissue')}>
//                                     Tissues
//                                 </button>
//                             </li>
//                             <li className={display === 'drug' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'drug' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('drug')}>
//                                     Drugs
//                                 </button>
//                             </li>
//                             <li className={display === 'dataset' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'dataset' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('dataset')}>
//                                     Datasets
//                                 </button>
//                             </li>
//                             <li className={display === 'intersection' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'intersection' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('intersection')}>
//                                     Datasets Intersection
//                                 </button>
//                             </li>
//                             <li className={display === 'cell-drug' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'cell-drug' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('cell-drug')}>
//                                     Cell line vs. Drug
//                                 </button>
//                             </li>
//                             <li className={display === 'tissue-drug' ? 'selected' : undefined}>
//                                 <button
//                                     className={display === 'tissue-drug' ? 'selected' : undefined}
//                                     type='button'
//                                     onClick={() => setDisplay('tissue-drug')}>
//                                     Tissue vs. Drug
//                                 </button>
//                             </li>
//                         </ul>
//                     </nav>
//                     {display === 'overview' && <Overview /> }
//                     {display === 'search' && <Search /> }
//                     {display === 'cell' && <Cell /> }
//                     {display === 'tissue' && <Tissue /> }
//                     {display === 'drug' && <Drug /> }
//                     {display === 'dataset' && <Dataset /> }
//                     {display === 'intersection' && <DatasetsIntersection /> }
//                     {display === 'cell-drug' && <CellVsDrug /> }
//                     {display === 'tissue-drug' && <TissueVsDrug /> }
//                 </div>
//             </div>
//         </StyledDescription>
//     );
// }
//
// export default DocDescription;
