import { gql } from 'apollo-boost';

// variable storing the gene compound fields.
const geneCompound = `
    id
    gene {
        id
        name
    }
    compound {
        id
        name
    }
`;

/**
 * @param {number} geneId - gene id for which the data is needed.
 * @returns - the information for the queried gene.
 */
const getGeneCompoundDatasetQuery = gql`
    query getGeneCompoundDataset($geneId: Int) {
        gene_compound_dataset(geneId: $geneId, all: true) {
            ${geneCompound}
            dataset {
                id
                name
            }
            n
        }
    }
`;

/**
 * @param {number} geneId/compoundId - gene/compound id for which the data is needed.
 * @returns - the information for the queried gene.
 */
const getGeneCompoundTissueDatasetQuery = gql`
    query getGeneCompoundTissueDataset($geneId: Int, $compoundId: Int) {
        gene_compound_tissue_dataset(geneId: $geneId, compoundId: $compoundId, all: true) {
            ${geneCompound}
            dataset {
                id
                name
            }
            tissue {
                id
                name
            }
            lower_analytic
            upper_analytic
            upper_permutation
            lower_permutation
            estimate
            pvalue_analytic
            sens_stat,
            mDataType,
        }
    }
`;

export {
    getGeneCompoundDatasetQuery,
    getGeneCompoundTissueDatasetQuery
};
