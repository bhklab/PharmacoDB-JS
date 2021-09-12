import { gql } from 'apollo-boost';

// variable storing the gene compound fields.
const geneCompound = `
    id
    gene {
        id
        name
        annotation {
            gene_seq_start
            gene_seq_end
        }
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
    query getGeneCompoundDataset($geneId: Int, $compoundId: Int) {
        gene_compound_dataset(geneId: $geneId, compoundId: $compoundId, all: true) {
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
    query getGeneCompoundTissueDataset($geneId: Int, $compoundId: Int, $tissueId: Int, $geneName: String, $compoundName: String, $tissueName: String) {
        gene_compound_tissue_dataset(geneId: $geneId, compoundId: $compoundId, tissueId: $tissueId, geneName: $geneName, compoundName: $compoundName, tissueName: $tissueName, all: true) {
            ${geneCompound}
            dataset {
                id
                name
            }
            tissue {
                id
                name
            }
            fdr_analytic
            fdr_permutation
            lower_analytic
            upper_analytic
            upper_permutation
            lower_permutation
            estimate
            pvalue_analytic
            pvalue_permutation
            significant_permutation,
            sens_stat
            mDataType
            n
        }
    }
`;

export {
    getGeneCompoundDatasetQuery,
    getGeneCompoundTissueDatasetQuery
};
