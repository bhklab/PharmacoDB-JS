import { gql } from 'apollo-boost';

// variable storing the gene compound fields.
const geneCompound = `
    id
    pvalue_analytic
    n
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
        }
    }
`;

export { getGeneCompoundDatasetQuery };