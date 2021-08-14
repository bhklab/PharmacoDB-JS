import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import queryString from 'query-string';
import { getCompoundQuery } from '../../queries/compound';
import { getGeneQuery } from '../../queries/gene';
import { getGeneCompoundTissueDatasetQuery } from '../../queries/gene_compound';
import TitleCase from '../../utils/convertToTitleCase';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import { StyledIndivPage, StyledSidebarList } from '../../styles/IndivPageStyles';
import Table from '../UtilComponents/Table/Table';
import ForestPlot from '../Plots/ForestPlot';

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
 * @returns {Array} - data array.
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
    const [finalGeneCompoundTissueDatasetData, setGeneCompoundTissueDatasetData] = useState([]);

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

    const {
        loading: geneCompoundTissueDatasetDataLoading,
        error: geneCompoundTissueDatasetDataError,
        data: geneCompoundTissueDatasetQueryData,
    } = useQuery(getGeneCompoundTissueDatasetQuery, { variables: { geneId: 64, compoundId: 1, tissueId: 6 } });


    // compound and gene information columns.
    const compoundInfoColumns = React.useMemo(() => COMPOUND_INFO_COLUMNS, []);
    const geneInfoColumns = React.useMemo(() => GENE_INFO_COLUMNS, []);

    // setting the state on load of compound data.
    useEffect(() => {
        // transform the data for the tables in the biomarker page.
        if (compoundQueryData && geneQueryData && geneCompoundTissueDatasetQueryData) {
            setTransformedCompoundData(
                transformCompoundTableData(compoundQueryData.singleCompound)
            );
            setTransformedGeneData(
                transformGeneTableData(
                    geneQueryData.gene,
                    compoundQueryData.singleCompound
                )
            );
            setGeneCompoundTissueDatasetData(geneCompoundTissueDatasetQueryData.gene_compound_tissue_dataset);
        }
    }, [compoundQueryData, geneQueryData, geneCompoundTissueDatasetQueryData]);

    return (
        <Layout>
            <StyledWrapper>
                <StyledIndivPage >
                    <div className='heading'>
                        <span className='title'>
                            {
                                `
                                    ${TitleCase(gene)} + 
                                    ${TitleCase(compound)} + 
                                    ${TitleCase(tissue)}
                                `
                            }
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
                                        <ForestPlot data={finalGeneCompoundTissueDatasetData} />
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
