/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { getCellLineCompoundExperimentsQuery } from '../../../queries/experiments';
import StyledWrapper from '../../../styles/utils';
import Layout from '../../UtilComponents/Layout';
import Loading from '../../UtilComponents/Loading';
import Error from '../../UtilComponents/Error';

/**
 * Component to render cell line vs component page.
 * @param {*} props requires cell_line and compound props, 
 * each containing either id (number) or name (string) of the respective properties.
 * @returns CellLineCompound component
 */
const CellLineCompound = (props) => {
    const { cell_line, compound } = props;

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
        },
        onError: (err) => {
            console.log(err);
        }
    });

    return(
        <Layout>
            <StyledWrapper>
                {
                    loading ? <Loading />
                    :
                    <div>
                        
                    </div>
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
