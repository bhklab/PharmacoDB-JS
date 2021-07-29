/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getTissueQuery } from '../../../queries/tissue';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import Table from '../../UtilComponents/Table/Table';
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
    },
    {
        Header: 'Names Used',
        accessor: 'name',
    },
];

const SIDE_LINKS = [
    { label: 'Annotations', name: 'annotations' },
    { label: 'Bar Plots', name: 'barPlots'},
    { label: 'Cell Line summary', name: 'cellLineSummary' },
    { label: 'Drug Summary', name: 'drugSummary' }
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
    if (data) {
        // join list of tissue source value into sources, split PascalCase names, and replace _ s
        const jsources = data.map((x) => ({
            name: formatName(x.name),
            sources: x.source.join(', '),
        }));
        // merge tissue names that have same source
        const output = [];
        jsources.forEach((item) => {
            const existing = output.filter((v) => v.sources === item.sources);
            if (existing.length) {
                const existingIndex = output.indexOf(existing[0]);
                output[existingIndex].name = output[existingIndex].name.concat(item.name);
            } else {
                if (typeof item.name === 'string') item.name = [item.name];
                output.push(item);
            }
        });
        output.forEach(item => {
            item.name = [...new Set(item.name)].join(', ');
        })
        return output;
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

    // load data from query into state
    const [tissue, setTissue] = useState({
        data: {},
        ready: false,
        notFound: false,
        error: false
    });

    // A section to display on the page
    const [display, setDisplay] = useState('annotations');

    const { loading } = useQuery(getTissueQuery, {
        variables: { tissueId: parseInt(params.id) },
        onCompleted: (data) => {
            console.log(data);
            if (data.tissue.name !== 'empty') {
                setTissue({...tissue, data: data.tissue, ready: true});
            }else{
                setTissue({...tissue, notFound: true});
            }
        },
        onError: () => {
            setTissue({...tissue, error: true})
        }
    });

    /**
     *
     * @param {String} link
     */
    const createSideLink = (link, i) => (
        <li key={i} className={display === link.name ? 'selected': undefined}>
            <button type='button' onClick={() => setDisplay(link.name)}>
                {link.label}
            </button>
        </li>
    );

    return (
        <Layout page={tissue.data.name}>
            <StyledWrapper>
                {
                    loading ? <Loading />
                        :
                        tissue.notFound ? <NotFoundContent />
                            :
                            tissue.error ? <Error />
                                :
                                tissue.ready &&
                                <StyledIndivPage className="indiv-tissues">
                                    <div className='heading'>
                                        <span className='title'>{formatName(tissue.data.name)}</span>
                                        <span className='attributes'>

                        </span>
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
                                                        <Table
                                                            columns={ANNOTATION_COLUMNS}
                                                            data={formatAnnotationData(tissue.data.synonyms)}
                                                            disablePagination
                                                        />
                                                    </Element>
                                                }
                                                {
                                                    display === 'barPlots' &&
                                                    <Element>
                                                        <PlotSection tissue={({ id: tissue.data.id, name: formatName(tissue.data.name) })} />
                                                    </Element>
                                                }
                                                {
                                                    display === 'cellLineSummary' &&
                                                    <Element className="section">
                                                        <CellLineSummaryTable tissue={({ id: tissue.data.id, name: formatName(tissue.data.name) })} />
                                                    </Element>
                                                }
                                                {
                                                    display === 'drugSummary' &&
                                                    <Element className="section">
                                                        <DrugSummaryTable tissue={({ id: tissue.data.id, name: formatName(tissue.data.name) })} />
                                                    </Element>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </StyledIndivPage>
                }
            </StyledWrapper>
        </Layout>
    );
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
