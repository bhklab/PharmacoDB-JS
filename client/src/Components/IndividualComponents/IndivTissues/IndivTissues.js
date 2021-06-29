/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getTissueQuery } from '../../../queries/tissue';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import SnakeCase from '../../../utils/convertToSnakeCase';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';

import {
    StyledIndivPage,
    StyledSidebar,
} from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

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

const SIDE_LINKS = ['Annotations', 'Plots'];

/**
 * Format name strings containing underscores or being PascalCased
 */
const formatName = (string) =>
    string.replaceAll(/_/g, ' ').replace(/([A-Z][a-z])/g, ' $1');

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
                output[existingIndex].name = output[existingIndex].name.concat(
                    `, ${item.name}`
                );
            } else {
                if (typeof item.name === 'string') item.name = [item.name];
                output.push(item);
            }
        });
        return output;
    }
    return null;
};

/**
 *
 * @param {String} link
 */
const createSideLink = (link) => (
    <Link
        key={link}
        className="link"
        activeClass="selected"
        to={`${SnakeCase(link)}`}
        spy
        smooth
        duration={200}
        offset={-400}
    >
        {link}
    </Link>
);

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
    // const tissueId = parseInt(params.id);

    // query to get the data for the single tissue.
    const { loading, error, data: queryData } = useQuery(getTissueQuery, {
        variables: { tissueId: parseInt(params.id) },
    });

    // load data from query into state
    const [tissue, setTissue] = useState({
        data: {},
        loaded: false,
    });

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
    // formatted data for annotation table
    const annotationColumns = React.useMemo(() => ANNOTATION_COLUMNS, []);
    const annotationData = React.useMemo(
        () => formatAnnotationData(data.synonyms),
        [data.synonyms]
    );
    return tissue.loaded ? (
        <Layout page={data.name}>
            <StyledWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <NotFoundContent />
                ) : (
                    <StyledIndivPage className="indiv-tissues">
                        <h1>{formatName(data.name)}</h1>
                        <StyledSidebar>
                            {SIDE_LINKS.map((link) => createSideLink(link))}
                        </StyledSidebar>
                        <div className="container">
                            <div className="content">
                                <Element className="section" name="annotations">
                                    <h3>Annotations</h3>
                                    <Table
                                        columns={annotationColumns}
                                        data={annotationData}
                                        disablePagination
                                    />
                                </Element>
                                <Element name="plots" className="section temp">
                                    <h3>Plots</h3>
                                    <PlotSection
                                        tissue={{
                                            id: data.id,
                                            name: data.name,
                                        }}
                                    />
                                </Element>
                            </div>
                        </div>
                    </StyledIndivPage>
                )}
            </StyledWrapper>
        </Layout>
    ) : null;
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
