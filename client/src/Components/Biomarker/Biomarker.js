import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import queryString from 'query-string';
import { getCompoundQuery } from '../../queries/compound';
import { getGeneQuery } from '../../queries/gene';
import SnakeCase from '../../utils/convertToSnakeCase';
import TitleCase from '../../utils/convertToTitleCase';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import { StyledIndivPage, StyledSidebarList } from '../../styles/IndivPageStyles';
import Table from '../UtilComponents/Table/Table';
import ForestPlot from '../Plots/ForestPlot';

const poly = [
    { x: 250.0, y: 300.0 },
    { x: 275, y: 275 },
    { x: 300.0, y: 300.0 },
    { x: 275.0, y: 325 },
    { x: 250.0, y: 300.0 },
];
const data = [
    {
        gene: 5512,
        drug: 415,
        tissue: 2,
        dataset: 5,
        n: 27,
        se: 1.031,
        estimate: -0.63,
        dataset_name: 'CCLE',
    },
    {
        gene: 5512,
        drug: 415,
        tissue: 2,
        dataset: 3,
        n: 5,
        se: 0.203,
        estimate: -0.085,
        dataset_name: 'FIMM',
    },
    {
        gene: 5512,
        drug: 415,
        tissue: 2,
        dataset: 4,
        n: 27,
        se: 1.033,
        estimate: 0.542,
        dataset_name: 'gCSI',
    },
];

// side links.
const SIDE_LINKS = [
    { label: 'Gene Information', name: 'gene_info' },
    { label: 'Compound Information', name: 'compound_info' },
    { label: 'Forest Plot', name: 'forest_plot' },
    { label: 'Manhattan Plot', name: 'manhattan_plot' },
];

// gene information columns.
const GENE_INFO_COLUMNS = [
    {
        Header: 'Gene Codes for Target of Compound | Yes/No',
        accessor: 'target',
    },
    {
        Header: 'ENSGID',
        accessor: 'ensg',
    },
    {
        Header: 'Gene Location',
        accessor: 'location',
    },
];

// compound information columns.
const COMPOUND_INFO_COLUMNS = [
    {
        Header: 'FDA Approval Status',
        accessor: 'status',
    },
    {
        Header: 'Active Trials',
        accessor: 'trials',
    },
    {
        Header: 'Annotated Targets',
        accessor: 'targets',
    },
];


/**
 *
 * @param {Object} data - compound information data.
 * @returns {Array} - transformed data [{status: fdaStatus, targets: ['', '']}]
 */
const transformCompoundTableData = (data) => {
    // grabs the fda status and targets from the data.
    const fdaStatus = data.compound.annotation.fda_status;
    const targets = data.targets.map((el) => el.name).join(', ');
    // return an array of object(s).
    return [
        {
            status: fdaStatus,
            targets,
        },
    ];
};

/**
 *
 * @param {Object} geneData - gene information data.
 * @param {Object} compoundData - compound information data.
 * @returns {Array} - transformed data.
 */
const transformGeneTableData = (geneData, compoundData) => {
    // grab the ensg and gene location.
    const ensg = geneData.name;
    const location = geneData.annotation.gene_seq_start;
    const symbol = geneData.annotation.symbol;
    const target = [...compoundData.targets.map((el) => el.name)].includes(
        'ERBB2'
    )
        ? 'Yes'
        : 'No';
    // return the transformed data.
    return [
        {
            ensg,
            location,
            target,
            symbol,
        },
    ];
};

/**
 * Biomarker component.
 *
 * @component
 *
 * returns (
 *   <Biomarker/>
 * )
 */
const Biomarker = (props) => {
    // get the compound, gene and tissue parameters.
    const { location } = props;
    const params = queryString.parse(location.search);
    const { compound, gene, tissue } = params;
    // set states for transformed data for tables.
    const [transformedCompoundData, setTransformedCompoundData] = useState([]);
    const [transformedGeneData, setTransformedGeneData] = useState([]);

    // A section to display on the page
    const [display, setDisplay] = useState('gene_info');

    /**
     * @param {String} link
     */
    const createSideLink = (link, i) => (
        <li key={i} className={display === link.name ? 'selected' : undefined}>
            <button type='button' onClick={() => setDisplay(link.name)}>
                {link.label}
            </button>
        </li>
    );

    // query to grab the gene and compound data based on the compound and gene id.
    const {
        loading: compoundDataLoading,
        error: compoundDataError,
        data: compoundQueryData,
    } = useQuery(getCompoundQuery, {
        variables: { compoundName: `${compound}` },
    });
    const {
        loading: geneDataLoading,
        error: geneDataError,
        data: geneQueryData,
    } = useQuery(getGeneQuery, { variables: { geneName: `${gene}` } });

    // compound and gene information columns.
    const compoundInfoColumns = React.useMemo(() => COMPOUND_INFO_COLUMNS, []);
    const geneInfoColumns = React.useMemo(() => GENE_INFO_COLUMNS, []);

    // setting the state on load of compound data.
    useEffect(() => {
        // transform the data for the tables in the biomarker page.
        if (compoundQueryData && geneQueryData) {
            setTransformedCompoundData(
                transformCompoundTableData(compoundQueryData.singleCompound)
            );
            setTransformedGeneData(
                transformGeneTableData(
                    geneQueryData.gene,
                    compoundQueryData.singleCompound
                )
            );
        }
    }, [compoundQueryData, geneQueryData]);

    return (
        <Layout>
            <StyledWrapper>
                <StyledIndivPage >
                    <div className='heading'>
                        <span className='title'>{data.name}
                            {`${TitleCase(gene)} + ${TitleCase(
                                compound
                            )} + ${TitleCase(tissue)}`}
                        </span>
                    </div>
                    <div className='wrapper'>
                        <StyledSidebarList>
                            {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                        </StyledSidebarList>
                        <div className="container">
                            <div className="content">
                                {
                                    display === 'gene_info' &&
                                    <Element
                                        className="section"
                                        name="gene_information"
                                    >
                                        <div className='section-title'>Gene Information</div>
                                        <Table
                                            columns={geneInfoColumns}
                                            data={transformedGeneData}
                                            disablePagination
                                        />
                                    </Element>
                                }
                                {
                                    display === 'compound_info' &&
                                    <Element
                                        className="section"
                                        name="compound_information"
                                    >
                                        <div className='section-title'>Compound Information</div>
                                        <Table
                                            columns={compoundInfoColumns}
                                            data={transformedCompoundData}
                                            disablePagination
                                        />
                                    </Element>
                                }
                                {
                                    display === 'forest_plot' &&
                                    <Element className="section" name="forest_plot">
                                        <ForestPlot />
                                    </Element>
                                }
                                {
                                    display === 'manhattan_plot' &&
                                    <Element className="section" name="manhattan_plot">
                                        <div />
                                    </Element>
                                }
                            </div>
                        </div>
                    </div>
                </StyledIndivPage>
            </StyledWrapper>
        </Layout>
    );
};

// proptypes for the biomarker component.
Biomarker.propTypes = {};

export default Biomarker;
