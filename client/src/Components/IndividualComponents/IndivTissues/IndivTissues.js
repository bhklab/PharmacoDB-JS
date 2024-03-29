/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getTissueQuery } from '../../../queries/tissue';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import Table from '../../UtilComponents/Table/Table';
import Loading from '../../UtilComponents/Loading';
import PlotSection from './PlotSection';
import CellLineSummaryTable from './Tables/CellLineSummaryTable';
import DrugSummaryTable from './Tables/DrugSummaryTable';
import { StyledIndivPage, StyledSidebarList } from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';
import convertToTitleCase from '../../../utils/convertToTitleCase';

const ANNOTATION_COLUMNS = [
    {
        Header: 'Sources',
        accessor: 'sources',
        Cell: (item) => {
            let datasets = item.cell.row.original.dataset;
            return (datasets.map((obj, i) => (
                obj.id? (
                <span key={i}>
                    <a href={`/datasets/${obj.id}`}>{obj.name}</a>{i + 1 < datasets.length ? ', ' : ''}
                    </span>
                    ) :
                    (<span key={i}>{obj.name}</span>)
            )
            ));
        }
    },
    {
        Header: 'Names Used',
        accessor: 'name',
    },
];

const SIDE_LINKS = [
    { label: 'Annotations', name: 'annotations' },
    { label: 'Bar Plots', name: 'barPlots' },
    { label: 'Cell Lines Summary', name: 'cellLineSummary' },
    { label: 'Compounds Summary', name: 'compoundSummary' }
];

/**
 * Format name strings containing underscores or being PascalCased
 */
const formatName = (string) =>
    convertToTitleCase(string.replaceAll(/_/g, ' ').replace(/([A-Z][a-z])/g, '$1'));

/**
 * Format data for the annotation table
 * @param {Array} data annotation data from the tissue API
 */
const formatAnnotationData = (data) => {
    if (data.synonyms) {
        const returnObj = data.synonyms.filter(obj => {return obj.name !== ""});
        if (returnObj.filter(obj => { return obj.dataset[0].name === "Standardized name in PharmacoSet" }).length === 0) {
            returnObj.push({ name: data.name, dataset: [{ name: "Standardized name in PharmacoSet", id: '' }] });
        }
        return returnObj;
    }
    return null;
};

/**
 * Parent component for the individual tissue page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivTissues/>
 * )
 */
const IndivTissues = (props) => {
    // parameter.
    const {
        match: { params },
    } = props;

    // query to get the data for the single tissue.
    const { loading, error, data: queryData } = useQuery(getTissueQuery, {
        variables: { tissueId: parseInt(params.id) },
    });

    // load data from query into state
    const [tissue, setTissue] = useState({
        data: {},
        loaded: false,
    });

    // A section to display on the page
    const [display, setDisplay] = useState('annotations');

    // to set the state on the change of the data.
    useEffect(() => {
        if (queryData !== undefined) {
            setTissue({
                data: queryData.tissue,
                loaded: true,
            });
        }
    }, [queryData]);

    // destructuring the tissue object.
    const { data } = tissue;

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

    return (tissue.loaded ? (
        <Layout page={data.name}>
            <StyledWrapper>
                {loading ? (<p>Loading...</p>)
                    : (error ? (<NotFoundContent />)
                        : (
                            <StyledIndivPage className="indiv-tissues">
                                <div className='heading'>
                                    <span className='title'>{formatName(data.name)}</span>
                                    <span className='attributes'></span>
                                </div>
                                <div className='wrapper'>
                                    <StyledSidebarList>
                                        {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                                    </StyledSidebarList>
                                    <div className="container">
                                        <div className="content">
                                            {
                                                display === 'annotations' &&
                                                <Element className="section" name="annotations">
                                                    <div className='section-title'>Annotations</div>
                                                    <Table columns={ANNOTATION_COLUMNS} data={formatAnnotationData(data)} disablePagination />
                                                </Element>
                                            }
                                            {
                                                display === 'barPlots' &&
                                                <Element>
                                                    <PlotSection tissue={({ id: data.id, name: formatName(data.name) })} />
                                                </Element>
                                            }
                                            {
                                                display === 'cellLineSummary' &&
                                                <Element className="section">
                                                    <CellLineSummaryTable tissue={({ id: data.id, name: formatName(data.name) })} />
                                                </Element>
                                            }
                                            {
                                                display === 'compoundSummary' &&
                                                <Element className="section">
                                                    <DrugSummaryTable tissue={({ id: data.id, name: formatName(data.name) })} />
                                                </Element>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </StyledIndivPage>
                        ))}
            </StyledWrapper>
        </Layout>
    ) : <Loading />);
};

IndivTissues.propTypes = {
    /**
     * IndivTissues' param id
     */
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default IndivTissues;
