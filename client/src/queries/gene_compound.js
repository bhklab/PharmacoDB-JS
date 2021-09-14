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
        uid
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
        gene_compound_tissue_dataset(geneId: $geneId, compoundId: $compoundId, tissueId: $tissueId, geneName: $geneName, compoundName: $compoundName, tissueName: $tissueName, all: false) {
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
            significant_permutation
            fdr_analytic
            fdr_permutation
            sens_stat
            mDataType
            n
        }
    }
`;

/**
 * Query used to get data for the Manhattan plot on Biomarker page.
 * @param compoundId/compoundName - identifier for the compound.
 * @param tissueId/tissueName = identifier for the tissue.
 * mDataType is specified as "rna" to filter the experiment data rna data type. 
 */
const getManhattanPlotDataQuery = gql`
    query getManhattanPlotDataQuery($compoundId: Int, $tissueId: Int, $compoundName: String, $tissueName: String, $mDataType: String) {
        gene_compound_tissue_dataset(compoundId: $compoundId, tissueId: $tissueId, compoundName: $compoundName, tissueName: $tissueName, mDataType: $mDataType, all: true) {
            gene {
                id
                name
                annotation {
                    symbol
                    chr
                    gene_seq_start
                    gene_seq_end
                }
            }
            dataset {
                id
                name
            }
            fdr_analytic
            fdr_permutation
            mDataType
        }
    }
`;

export {
    getGeneCompoundDatasetQuery,
    getGeneCompoundTissueDatasetQuery,
    getManhattanPlotDataQuery
};
