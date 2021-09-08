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
            <p>Documentation Section</p>
        </StyledIndivPage>
    );
};

export default DocDescription;
