import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import queryString from 'query-string';
import { getCompoundQuery } from '../../queries/compound';
import { getGeneQuery } from '../../queries/gene';
import { getTissueIdBasedOnTissueName } from '../../queries/tissue';
import {
    getGeneCompoundTissueDatasetQuery,
    getGeneCompoundDatasetQuery,
} from '../../queries/gene_compound';
import TitleCase from '../../utils/convertToTitleCase';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import { StyledIndivPage, StyledSidebarList } from '../../styles/IndivPageStyles';
import Table from '../UtilComponents/Table/Table';
import ForestPlot from '../Plots/ForestPlot';
import Loading from '../UtilComponents/Loading';
import ManhattanPlotContainer from './ManhattanPlotContainer';

// side links.
const SIDE_LINKS = [
    { label: 'Forest Plot', name: 'forest_plot' },
    { label: 'Manhattan Plot', name: 'manhattan_plot' },
    { label: 'Gene Information', name: 'gene_info' },
    { label: 'Compound Information', name: 'compound_info' },
];

// gene information columns.
const GENE_INFO_COLUMNS = [
    {
        Header: 'Gene Status as Compound Target',
        accessor: 'target',
        center: true
    },
    {
        Header: 'Symbol',
        accessor: 'symbol',
        center: true,
        Cell: (row) => <a href={`genes/${row.row.original.gene_id}`} target='_blank'>{row.row.original.symbol}</a>
    },
    {
        Header: 'Ensembl Gene ID',
        accessor: 'ensg',
        center: true
    },
    {
        Header: 'Gene Location',
        accessor: 'location',
        center: true
    },
];

// compound information columns.
const COMPOUND_INFO_COLUMNS = [
    {
        Header: 'Name',
        accessor: 'name',
        Cell: (row) => <a href={`compounds/${row.row.original.uid}`} target='_blank'>{row.row.original.name}</a>
    },
    {
        Header: 'FDA Approval Status',
        accessor: 'status',
    },
    // {
    //     Header: 'Active Trials',
    //     accessor: 'trials',
    // },
    {
        Header: 'Compound Targets',
        accessor: 'target',
    },
    {
        Header: 'Genes',
        accessor: 'genes',
        Cell: (row) => {
            const geneArray = row.row.original.genes;

            const genes = geneArray.map((gene, i) => {
                let returnData = ''
                if (i + 1 === geneArray.length) {
                    returnData = <a href={`genes/${gene.id}`} target='_blank' key={gene.symbol}>{gene.symbol}</a>
                } else {
                    returnData = (
                        <>
                            <a href={`genes/${gene.id}`} target='_blank' key={gene.symbol}>{gene.symbol}</a>
                            <span>, </span>
                        </>
                    )
                }
                return returnData;
            });

            return genes;
        }
    }
];


/**
 *
 * @param {Object} data - compound information data.
 * @returns {Array} - transformed data [{status: fdaStatus, targets: ['', '']}]
 */
const transformCompoundTableData = (data) => {
    // grabs the fda status and targets from the data.
    const name = data.compound.name;
    const uid = data.compound.uid;
    const fdaStatus = data.compound.annotation.fda_status;
    // const targets = data.targets.map((el) => el.name).join(', ');
    // return an array of object(s).
    return data.targets.map((target) => ({
        status: fdaStatus,
        target: target.target_name,
        genes: target.genes.map(gene => ({
            id: gene.id,
            symbol: gene.annotation.symbol,
        })),
        name,
        uid,
    }));
};

/**
 *
 * @param {Object} geneData - gene information data.
 * @param {Object} compoundData - compound information data.
 * @param {string} gene - input gene from the param.
 * @returns {Array} - data array.
 */
const transformGeneTableData = (geneData, compoundData, gene) => {
    // grab the ensg and gene location.
    const ensg = geneData.name;
    const location = geneData.annotation.gene_seq_start;
    const symbol = geneData.annotation.symbol;
    const gene_id = geneData.id;
    const genes = [];

    // get the list of genes.
    compoundData.targets.forEach(target => {
        target.genes.forEach(gene => genes.push(gene.annotation.symbol));
    });

    const target = genes.includes(gene) ? 'Yes' : 'No';

    // return the transformed data.
    return [
        {
            ensg,
            location,
            target,
            symbol,
            gene_id,
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
    const [compoundUID, setCompoundUID] = useState('');
    const [geneId, setGeneId] = useState('');

    // A section to display on the page
    const [display, setDisplay] = useState('forest_plot');

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

    // query to grab the gene and compound data based on the compound and gene name.
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

    const { data: tissueData } = useQuery(getTissueIdBasedOnTissueName, { variables: { tissueName: `${tissue}` } });

    // query based on gene, compound and tissue.
    const [getGeneCompoundTissueDatasetData] = useLazyQuery(getGeneCompoundTissueDatasetQuery, {
        onCompleted: (data) => {
            setGeneCompoundTissueDatasetData(data.gene_compound_tissue_dataset);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // query based on compound and gene.
    const [getGeneCompoundDatasetData] = useLazyQuery(getGeneCompoundDatasetQuery, {
        onCompleted: (data) => {
            setGeneCompoundTissueDatasetData(data.gene_compound_dataset);
        },
        onError: (error) => {
            console.log(error);
        }
    });

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
                    compoundQueryData.singleCompound,
                    gene,
                )
            );
            setCompoundUID(compoundQueryData.singleCompound.compound.uid);
            setGeneId(geneQueryData.gene.id);
        };

        // calling right function based on the params.
        if (gene && compound && tissue) {
            getGeneCompoundTissueDatasetData({ variables: { geneName: gene, compoundName: compound, tissueName: tissue } });
        } else if (gene && compound) {
            getGeneCompoundDatasetData({ variables: { geneName: gene, compoundName: compound } });
        }

    }, [compoundQueryData, geneQueryData]);

    return (
        <Layout>
            {
                compoundUID && geneId ?
                    <StyledWrapper>
                        <StyledIndivPage >
                            <div className='heading'>
                                <span className='title' style={{ fontSize: '2vw' }}>
                                    <span> Association of </span>
                                    <span>
                                        <a href={`/compounds/${compoundUID}`} target='_blank'> {`${TitleCase(compound)}`} </a>
                                    </span>
                                    <span> and </span>
                                    <span className='link'>
                                        <a href={`/genes/${geneId}`} target='_blank'> {`${gene.toUpperCase()}`}  </a>
                                    </span>
                                    {
                                        tissue
                                            ? <React.Fragment>
                                                <span> in </span>
                                                <span className='link'>
                                                    <a href={`/tissues/${tissueData.tissue.id}`} target='_blank'> {`${tissue.toUpperCase()}`}  </a>
                                                </span>
                                                <span> tissue </span>
                                            </React.Fragment>
                                            : ''
                                    }
                                </span>
                            </div>
                            <div className='wrapper'>
                                <StyledSidebarList>
                                    {SIDE_LINKS.map((link, i) => createSideLink(link, i))}
                                </StyledSidebarList>
                                <div className='container'>
                                    <div className='content'>
                                        {
                                            finalGeneCompoundTissueDatasetData.length > 0
                                                ? (
                                                    display === 'forest_plot' &&
                                                    <Element className='section' name='forest_plot'>
                                                        <ForestPlot data={finalGeneCompoundTissueDatasetData} />
                                                    </Element>
                                                )
                                                : <Loading />
                                        }
                                        {
                                            display === 'manhattan_plot' &&
                                            <Element className="section" name="manhattan_plot">
                                                <ManhattanPlotContainer biomarker={transformedGeneData[0]} compound={compound} tissue={tissue} />
                                            </Element>
                                        }
                                        {
                                            display === 'gene_info' &&
                                            <Element
                                                className='section'
                                                name='gene_information'
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
                                                className='section'
                                                name='compound_information'
                                            >
                                                <div className='section-title'>Compound Information</div>
                                                <Table
                                                    columns={compoundInfoColumns}
                                                    data={transformedCompoundData}
                                                />
                                            </Element>
                                        }
                                    </div>
                                </div>
                            </div>
                        </StyledIndivPage>
                    </StyledWrapper>
                    : <Loading />
            }
        </Layout>
    );
};

// proptypes for the biomarker component.
Biomarker.propTypes = {};

export default Biomarker;
