/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getGeneQuery } from '../../../queries/gene';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import SnakeCase from '../../../utils/convertToSnakeCase';
import Table from '../../UtilComponents/Table/Table';

import {
    StyledIndivPage,
    StyledSidebar,
} from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SYNONYM_COLUMNS = [
    {
        Header: 'Ensembl Gene ID',
        accessor: 'id',
    },
];

const LINK_COLUMNS = [
    {
        Header: 'Genecard',
        accessor: 'id',
    },
];

const SIDE_LINKS = ['Synonyms', 'Links'];

/**
 * Format data for synonym and link tables
 * @param {String} id,link gene id and link to reference
 */
const formatTableLinks = (id, link) => [
    {
        id: (
            <a href={link} target="_blank">
                <div style={{ textAlign: 'center' }}> {id} </div>
            </a>
        ),
    },
];

/**
 * Format data for the synonyms table
 * @param data synonym data from the gene API
 */
const formatSynonymData = (data) => {
    if (data) {
        const link = `http://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${data.ensg}`;
        return formatTableLinks(data.ensg, link);
    }
    return null;
};

/**
 * Format data for link table
 * @param data link data from the gene API
 */
const formatLinkData = (data) => {
    if (data) {
        const link = `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${data.name}`;
        return formatTableLinks(data.name, link);
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
 * Parent component for the individual gene page.
 *
 * @component
 * @example
 *
 * return (
 *   <IndivGenes/>
 * )
 */
const IndivGenes = (props) => {
    // parameter.
    const {
        match: { params },
    } = props;
    // const geneId = parseInt(params.id);

    // query to get the data for the single gene.
    const { loading, error, data: queryData } = useQuery(getGeneQuery, {
        variables: { geneId: parseInt(params.id) },
    });
    // load data from query into state
    const [gene, setGene] = useState({
        data: {},
        loaded: false,
    });

    // to set the state on the change of the data.
    useEffect(() => {
        if (queryData !== undefined) {
            setGene({
                data: queryData.gene,
                loaded: true,
            });
        }
    }, [queryData]);

    // destructuring the gene object.
    const { data } = gene;

    // formatted data for synonyms annotation table
    const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
    const synonymData = React.useMemo(
        () => formatSynonymData(data.annotation),
        [data.annotation]
    );

    // formatted data for links annotation table
    const linkColumns = React.useMemo(() => LINK_COLUMNS, []);
    const linkData = React.useMemo(() => formatLinkData(data), [data]);

    return gene.loaded ? (
        <Layout page={data.name}>
            <StyledWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <NotFoundContent />
                ) : (
                    <StyledIndivPage className="indiv-genes">
                        <h1>{data.name}</h1>
                        <StyledSidebar>
                            {SIDE_LINKS.map((link) => createSideLink(link))}
                        </StyledSidebar>
                        <div className="container">
                            <div className="content">
                                <Element className="section" name="synonyms">
                                    <h3>Synonyms</h3>
                                    <Table
                                        columns={synonymColumns}
                                        data={synonymData}
                                        disablePagination
                                    />
                                </Element>
                                <Element className="section" name="links">
                                    <h3>Links</h3>
                                    <Table
                                        columns={linkColumns}
                                        data={linkData}
                                        disablePagination
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

IndivGenes.propTypes = {
    /**
     * IndivGenes' param id
     */
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default IndivGenes;
