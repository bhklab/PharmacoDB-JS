/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getCompoundQuery } from '../../../queries/compound';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';
import CellLinesSummaryTable from './Tables/CellLinesSummaryTable';
import TissuesSummaryTable from './Tables/TissuesSummaryTable';
import MolecularFeaturesTable from './Tables/MolecularFeaturesTable';
import AnnotatedTargetsTable from './Tables/AnnotatedTargetsTable';
import Loading from '../../UtilComponents/Loading';
import { StyledIndivPageTitle, StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

// different external links.
const PUBCHEM = 'https://pubchem.ncbi.nlm.nih.gov/compound/';
const DTC = 'https://drugtargetcommons.fimm.fi/search?txtSearchClient=';
const CHEMBL = 'https://www.ebi.ac.uk/chembl/compound_report_card/';
const REACTOME = 'https://reactome.org/content/detail/R-ALL-';

const SYNONYM_COLUMNS = [
    {
        Header: 'Sources',
        accessor: 'source',
        Cell: (item) => {
            let datasets = item.cell.row.original.source;
            return (datasets.map((obj, i) => (
                obj.id
                    ? (
                        <span key={i}>
                            <a href={`/datasets/${obj.id}`}>{obj.name}</a>{i + 1 < datasets.length ? ', ' : ''}
                        </span>
                    )
                    : (
                        <span key={i}>{obj.name}</span>
                    )
            )
            ));
        }
    },
    {
        Header: 'Names Used',
        accessor: 'name',
    },
];

const ANNOTATION_COLUMNS = [
    {
        Header: 'Database',
        accessor: 'db',
    },
    {
        Header: 'Identifier',
        accessor: 'identifier',
    },
];

const SIDE_LINKS = [
    { label: 'Synonyms and IDs', name: 'synonyms' },
    { label: 'Annotated Targets', name: 'targets' },
    { label: 'Bar Plots', name: 'barplots' },
    { label: 'AAC (Cell Lines)', name: 'aacCells' },
    { label: 'AAC (Tissues)', name: 'aacTissues' },
    { label: 'Cell Line Summary', name: 'cellSummary' },
    { label: 'Tissue Summary', name: 'tissueSummary' },
    { label: 'Molecular Features', name: 'molFeature' },
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the experiment API
 */
const formatSynonymData = (data) => {
    if (data.synonyms) {
        const returnObj = data.synonyms.filter(obj => {return obj.name !== ""});
        if (returnObj.filter(obj => { return obj.source[0].name === "Standardized name in PharmacoSet" }).length === 0) {
            returnObj.push({ name: data.compound.name, source: [{ name: "Standardized name in PharmacoSet", id: '' }] });
        }
        return returnObj;
    }
    return null;
};

/**
 * Format data for the external ids annotation table
 * @param {Array} data annotation data from the compound API
 */
const formatAnnotationData = (data) => {
    let annotationData = {
        identifiers: [],
        externalLinks: []
    }

    if (data) {
        const { annotation } = data;
        if (annotation.smiles && !(annotation.smiles.match(/na|null/i))) {
            annotationData.identifiers.push({ db: 'SMILES', identifier: annotation.smiles, });
        }
        if (annotation.inchikey && !(annotation.inchikey.match(/na|null/i))) {
            annotationData.identifiers.push({ db: 'InChiKey', identifier: annotation.inchikey, });
        }
        if (annotation.pubchem && !(annotation.pubchem.match(/na|null/i))) {
            annotationData.externalLinks.push(
                {
                    db: 'PubChem',
                    identifier: <a href={`${PUBCHEM}${annotation.pubchem}`} target="_blank" rel="noopener noreferrer">{annotation.pubchem}</a>,
                });
        }
        if (annotation.chembl && !(annotation.chembl.match(/na|null/i))) {
            annotationData.externalLinks.push(
                {
                    db: 'ChEMBL',
                    identifier: <a href={`${CHEMBL}${annotation.chembl}`} target="_blank" rel="noopener noreferrer">{annotation.chembl}</a>,
                }
            )
            annotationData.externalLinks.push(
                {
                    db: 'Drug Target Commons',
                    identifier: <a href={`${DTC}${annotation.chembl}`} target="_blank" rel="noopener noreferrer">{annotation.chembl}</a>,
                }
            )
        }
        if (annotation.reactome && !(annotation.reactome.match(/na|null/i))) {
            annotationData.externalLinks.push(
                {
                    db: 'Reactome',
                    identifier: <a href={`${REACTOME}${annotation.reactome}`} target="_blank" rel="noopener noreferrer">{annotation.reactome}</a>,
                }
            )
        }
    }
    return annotationData;
};

/**
 * Parent component for the individual compound page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivCompounds/>
 * )
 */
const IndivCompounds = (props) => {
    // parameter.
    const {
        match: { params },
    } = props;

    // load data from query into state
    const [compound, setCompound] = useState({
        data: {},
        loaded: false,
    });
    // A section to display on the page
    const [display, setDisplay] = useState('synonyms');

    // query to get the data for the single compound.
    const { loading, error } = useQuery(getCompoundQuery, {
        variables: {
            compoundUID: params.id,
            // compoundId: params.id.match(/^[0-9]+$/) ? parseInt(params.id) : undefined,
            // compoundName: typeof params.id === 'string' ? params.id : undefined
        },
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setCompound({
                data: data.singleCompound,
                synonymData: formatSynonymData(data.singleCompound),
                annotationData: formatAnnotationData(data.singleCompound.compound),
                loaded: true,
            });
        }
    });

    /**
     *
     * @param {String} link
     */
    const createSideLink = (link, i) => (
        <li key={i} className={display === link.name ? 'selected' : undefined}>
            <button type='button' onClick={() => setDisplay(link.name)}>
                {link.label}
            </button>
        </li>
    );
    return compound.loaded ? (
        <Layout page={compound.data.compound.name}>
            <StyledWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <NotFoundContent />
                ) : (
                            <StyledIndivPage className="indiv-compounds">
                                <div className='heading'>
                                    <StyledIndivPageTitle smalltxt={compound.data.compound.name.length > 30}>{compound.data.compound.name}</StyledIndivPageTitle>
                                    <span className='attributes'>
                                        <span>FDA Approval Status: </span>
                                        <span className='regular'>
                                            {compound.data.compound.annotation.fda_status}
                                        </span>
                                    </span>
                                </div>
                                <div className='wrapper'>
                                    <StyledSidebarList>
                                        {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                                    </StyledSidebarList>
                                    <div className="container">
                                        <div className="content">
                                            {
                                                display === 'synonyms' &&
                                                <React.Fragment>
                                                    <Element className="section" name="synonyms">
                                                        <div className='section-title'>Synonyms</div>
                                                        <Table
                                                            columns={SYNONYM_COLUMNS}
                                                            data={compound.synonymData}
                                                            disablePagination
                                                        />
                                                    </Element>
                                                    {
                                                        compound.annotationData.identifiers.length > 0 ?
                                                            <Element className="section" name="external_ids">
                                                                <div className='section-title'>Identifiers</div>
                                                                <Table
                                                                    columns={ANNOTATION_COLUMNS}
                                                                    data={compound.annotationData.identifiers}
                                                                    disablePagination
                                                                    showHeader={false}
                                                                />
                                                            </Element>
                                                            :
                                                            ''
                                                    }
                                                    {
                                                        compound.annotationData.externalLinks.length > 0 ?
                                                            <Element className="section" name="external_ids">
                                                                <div className='section-title'>External Links</div>
                                                                <Table
                                                                    columns={ANNOTATION_COLUMNS}
                                                                    data={compound.annotationData.externalLinks}
                                                                    disablePagination
                                                                    showHeader={false}
                                                                />
                                                            </Element>
                                                            :
                                                            ''
                                                    }
                                                </React.Fragment>
                                            }
                                            {
                                                display === 'targets' &&
                                                <Element className="section">
                                                    <AnnotatedTargetsTable compound={({ id: compound.data.compound.id, name: compound.data.compound.name })} />
                                                </Element>
                                            }
                                            <Element>
                                                <PlotSection
                                                    display={display}
                                                    compound={{
                                                        id: compound.data.compound.id,
                                                        name: compound.data.compound.name,
                                                    }}
                                                />
                                            </Element>
                                            {
                                                display === 'cellSummary' &&
                                                <Element className="section">
                                                    <div className='section-title'>Cell Line Summary</div>
                                                    <CellLinesSummaryTable compound={({ id: compound.data.compound.id, name: compound.data.compound.name })} />
                                                </Element>
                                            }
                                            {
                                                display === 'tissueSummary' &&
                                                <Element className="section">
                                                    <div className='section-title'>Tissue Summary</div>
                                                    <TissuesSummaryTable compound={({ id: compound.data.compound.id, name: compound.data.compound.name })} />
                                                </Element>
                                            }
                                            {
                                                display === 'molFeature' &&
                                                <Element className="section">
                                                    <MolecularFeaturesTable compound={({ id: compound.data.compound.id, name: compound.data.compound.name })} />
                                                </Element>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </StyledIndivPage>
                        )}
            </StyledWrapper>
        </Layout>
    ) : <Loading />;
};

IndivCompounds.propTypes = {
    /**
     * IndivCompounds' param id
     */
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default IndivCompounds;
