/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Element } from 'react-scroll';
import PropTypes from 'prop-types';
import Layout from '../../UtilComponents/Layout';
import { getCompoundQuery } from '../../../queries/compound';
import { NotFoundContent } from '../../UtilComponents/NotFoundPage';
import Table from '../../UtilComponents/Table/Table';
import PlotSection from './PlotSection';

import {
    StyledIndivPage,
    StyledSidebarList
} from '../../../styles/IndivPageStyles';
import StyledWrapper from '../../../styles/utils';

const SYNONYM_COLUMNS = [
    {
        Header: 'Sources',
        accessor: 'datasetObj',
        Cell: (item) => {
            let datasets = item.row.original.datasetObj;
            return(datasets.map((obj, i) => (
                    obj.id? (
                            <span key={i}>
                        <a href={`/datasets/${obj.id}`}>{obj.name}</a>{ i + 1 < datasets.length ? ', ' : ''}
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
    {label: 'Synonyms and IDs', name: 'synonyms'},
    {label: 'Bar Plots', name: 'barplots'},
    {label: 'AAC (Cell Lines)', name: 'aacCells'},
    {label: 'AAC (Tissues)', name: 'aacTissues'},
    {label: 'Cell Line Summary', name: 'cellSummary'},
    {label: 'Tissue Summary', name: 'tissueSummary'},
    {label: 'Molecular Features', name: 'molFeature'},
];

/**
 * Format data for the synonyms table
 * @param {Array} data synonym data from the compound API
 */
const formatSynonymData = (data) => {
    if (data.synonyms) {
        // define datasetId object to find id of sources
        const datasetId = {};
        data.datasets.forEach((x) => { datasetId[x.name] = x.id ; })
        // collect source ids and initiate dataset objects to store sources
        const tableData = []
        for (let x of data.synonyms) {
            const datasetObj = [];
            for (let item of x.source){
                datasetObj.push({name:item, id:datasetId[item]});
            }
            tableData.push({name: x.name, datasetObj: datasetObj});
        }
        // merge sources with same synonyms
        const returnList = [];
        for (let x of tableData){
            const index = returnList.findIndex((item) => item.name === x.name )
            if (index === -1)  returnList.push(x);
            else
                for (let source of x.datasetObj)
                    returnList[index].datasetObj.push({name: source['name'], id: source['id']});
        }
        console.log('dasdad',tableData);
        // const synonymData = data.synonyms.map((x) => ({
        //     name: x.name,
        //     sources: x.source.join(', '),
        // }));
        returnList.push({name:data.compound.name , datasetObj:[{name: "PharmacoGx", id: ""}]});
        return returnList;
    }
    return null;
};

/**
 * Format data for the external ids annotation table
 * @param {Array} data annotation data from the compound API
 */
const formatAnnotationData = (data) => {
    const modifiedData = [];
    if (data) {
        const { annotation } = data;
        modifiedData.push(
            {
                db: 'SMILES',
                identifier: annotation.smiles,
            },
            {
                db: 'InChiKey',
                identifier: annotation.inchikey,
            },
            {
                db: 'PubChem ID',
                identifier: annotation.pubchem,
            }
        );
    }
    return modifiedData;
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
    // const compoundId = parseInt(params.id);

    // query to get the data for the single compound.
    const { loading, error, data: queryData } = useQuery(getCompoundQuery, {
        variables: { compoundId: parseInt(params.id) },
    });

    // load data from query into state
    const [compound, setCompound] = useState({
        data: {},
        loaded: false,
    });
    // A section to display on the page
    const [display, setDisplay] = useState('synonyms');

    // to set the state on the change of the data.
    useEffect(() => {
        if (queryData !== undefined) {
            setCompound({
                data: queryData.singleCompound,
                loaded: true,
            });
        }
    }, [queryData]);

    // destructuring the compound object.
    const { data } = compound;

    // formatted data for synonyms annotation table
    const synonymColumns = React.useMemo(() => SYNONYM_COLUMNS, []);
    const synonymData = React.useMemo(() => formatSynonymData(data), [
        data.synonyms,
    ]);

    // formatted data for external ids annotation table
    const annotationColumns = React.useMemo(() => ANNOTATION_COLUMNS, []);
    const annotationData = React.useMemo(
        () => formatAnnotationData(data.compound),
        [data.compound]
    );

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

    return compound.loaded ? (
        <Layout page={data.compound.name}>
            <StyledWrapper>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <NotFoundContent />
                ) : (
                    <StyledIndivPage className="indiv-compounds">
                        <div className='heading'>
                            <span className='title'>{data.compound.name}</span>
                            <span className='attributes'>
                                FDA Approval Status:
                                <span className={`value ${data.compound.annotation.fda_status === 'Approved' ? 'highlight' : 'regular'}`}>
                                    {data.compound.annotation.fda_status}
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
                                                    columns={synonymColumns}
                                                    data={synonymData}
                                                    disablePagination
                                                />
                                            </Element>
                                            <Element
                                                className="section"
                                                name="external_ids"
                                            >
                                                <div className='section-title'>External IDs</div>
                                                <Table
                                                    columns={annotationColumns}
                                                    data={annotationData}
                                                    disablePagination
                                                />
                                            </Element>
                                        </React.Fragment>
                                    }
                                    {
                                        display === 'targets' &&
                                        <Element className="section" name="annotated_targets">
                                            <div className='section-title'>Annotated Targets</div>
                                            <div className="text">
                                                {data.targets
                                                    ? data.targets
                                                        .map((x) => x.name)
                                                        .join(', ')
                                                    : ''}
                                            </div>
                                        </Element>
                                    }
                                    <Element>
                                        <PlotSection
                                            display={display}
                                            compound={{
                                                id: data.compound.id,
                                                name: data.compound.name,
                                            }}
                                        />
                                    </Element>
                                </div>
                            </div>
                        </div>
                    </StyledIndivPage>
                )}
            </StyledWrapper>
        </Layout>
    ) : null;
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
