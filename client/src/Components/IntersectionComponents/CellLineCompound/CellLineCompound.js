/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLineCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import CellLineCompoundDoseResponse from './CellLineCompoundDoseResponse';
import IntersectionSummaryTable from '../IntersectionSummaryTable';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';
import { StyledIntersectionComponent } from '../../../styles/IntersectionComponentStyles';

/**
 * Component to render cell line vs component page.
 * @param {*} props requires cell_line and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns CellLineCompound component
 */
const CellLineCompound = (props) => {
    const { cell_line, compound } = props;
    const [error, setError] = useState(false);
    const [experiments, setExperiments] = useState(undefined);

    // query to get the data for the single gene.
    const { loading } = useQuery(getCellLineCompoundExperimentsQuery, {
        variables: { 
            cellLineId: typeof Number(cell_line) === 'number' ? Number(cell_line) : undefined,
            cellLineName: typeof cell_line === 'string' ? cell_line : undefined,
            compoundId: typeof Number(compound) === 'number' ? Number(compound) : undefined,
            compoundName: typeof compound === 'string' ? compound : undefined
        },
        onCompleted: (data) => {
            console.log(data);
            setExperiments(data.experiments);
        },
        onError: (err) => {
            console.log(err);
            setError(true);
        }
    });

    const getLink = (name, data) => (
        <a href={`/${name}/${data.id}`}>{data.name}</a>
    );

    return(
        <Layout>
            <StyledWrapper>
                {
                    loading ? <Loading />
                    :
                    error ? <Error />
                    :
                    typeof experiments !== 'undefined' &&
                    <React.Fragment>
                        {
                            experiments.length > 0 ?
                            <StyledIntersectionComponent>
                                <h2>{getLink('cell_lines', experiments[0].cell_line)} treated with {getLink('compounds', experiments[0].compound)}</h2>
                                <CellLineCompoundDoseResponse experiments={experiments} />
                                <IntersectionSummaryTable experiments={experiments.map(exp => ({dataset: exp.dataset, profile: exp.profile}))} />
                            </StyledIntersectionComponent>
                            :
                            <h3>No experiments were found with a given combination of cell line and compound.</h3>
                        }
                    </React.Fragment>
                }
            </StyledWrapper>
        </Layout>
    );
}

CellLineCompound.propTypes = {
    cell_line: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    compound: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default CellLineCompound;
