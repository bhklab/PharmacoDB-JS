import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link, Element } from 'react-scroll';
import { getCompoundQuery } from '../../queries/compound';
import { getGeneQuery } from '../../queries/gene';
import SnakeCase from '../../utils/convertToSnakeCase';
import Layout from '../UtilComponents/Layout';
import StyledWrapper from '../../styles/utils';
import { StyledIndivPage, StyledSidebar } from '../../styles/IndivPageStyles';
import Table from '../UtilComponents/Table/Table';
import ForestPlot from '../Plots/ForestPlot';


// side links.
const SIDE_LINKS = ['Gene Information', 'Compound Information', 'Forest Plots']

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
 * @param {String} link
 */
const createSideLink = (link) => (
    <Link key={link} className="link" activeClass="selected" to={`${SnakeCase(link)}`} spy smooth duration={200} offset={-400}>{link}</Link>
);


/**
 * 
 * @param {Object} data - compound information data. 
 * @returns {Array} - transformed data [{status: fdaStatus, targets: ['', '']}]
 */
const transformCompoundTableData = (data) => {
    // grabs the fda status and targets from the data.
    const fdaStatus = data.compound.annotation.fda_status;
    const targets = data.targets.map(el => el.name);
    // return an array of object(s).
    return [{
        status: fdaStatus,
        targets,
    }];
}


/**
 * 
 * @param {Object} data - gene information data. 
 * @returns {Array} - transformed data.
 */
const transformGeneTableData = (data) => {
    console.log(data);
    // grab the ensg and gene location.
    const ensg = data.annotation.ensg;
    const location = data.annotation.gene_seq_start;
    // return the transformed data.
    return [{
        ensg,
        location,
    }]
}


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
    // set states for transformed data for tables.
    const [transformedCompoundData, setTransformedCompoundData] = useState([]);
    const [transformedGeneData, setTransformedGeneData] = useState([]);

    // query to grab the gene and compound data based on the compound and gene id.
    const {
        loading: compoundDataLoading, error: compoundDataError, data: compoundQueryData
    } = useQuery(getCompoundQuery, { variables: { compoundId: 415 } });
    const {
        loading: geneDataLoading, error: geneDataError, data: geneQueryData
    } = useQuery(getGeneQuery, { variables: { geneId: 5512 } });

    // compound and gene information columns.
    const compoundInfoColumns = React.useMemo(() => COMPOUND_INFO_COLUMNS, []);
    const geneInfoColumns = React.useMemo(() => GENE_INFO_COLUMNS, []);

    // setting the state on load of compound data.
    useEffect(() => {
        // transform the data for the tables in the biomarker page.
        if (compoundQueryData && geneQueryData) {
            setTransformedCompoundData(transformCompoundTableData(compoundQueryData.singleCompound));
            setTransformedGeneData(transformGeneTableData(geneQueryData.gene));
        }
    }, [compoundQueryData, geneQueryData])

    return (
        <Layout>
            <StyledWrapper>
                <StyledIndivPage >
                    <h1>ERBB2 + LAPATINIB + BREAST</h1>
                    <StyledSidebar>
                        {
                            SIDE_LINKS.map((link) => createSideLink(link))
                        }
                    </StyledSidebar>
                    <div className="container">
                        <div className="content">
                            <Element className="section" name="gene_information">
                                <h3>Gene Information</h3>
                                <Table columns={geneInfoColumns} data={transformedGeneData} disablePagination />
                            </Element>
                            <Element className="section" name="compound_information">
                                <h3>Compound Information</h3>
                                <Table columns={compoundInfoColumns} data={transformedCompoundData} disablePagination />
                            </Element>
                            <Element className="section" name="forest_plots">
                                <h3>Plots</h3>
                                <ForestPlot />
                            </Element>
                        </div>
                    </div>
                </StyledIndivPage>
            </StyledWrapper>
        </Layout >
    );
}

// proptypes for the biomarker component.
Biomarker.propTypes = {

};

export default Biomarker;
