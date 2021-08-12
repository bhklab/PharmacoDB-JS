import { gql } from 'apollo-boost';

// Fragment containing the gene id, name and annotation.
const GENE_FIELDS = gql`
  fragment GeneFields on Gene {
    id
    name
    annotation {
        gene_id
        symbol
        gene_seq_start
        gene_seq_end
        chr
        strand
    }
  }
`;

/**
 * @param {boolean} all - takes a boolean value if to search all the genes or not.
 * @returns - Query returns the list of genes with the id and name of the gene
 * and also returning the annotation object for each of the gene in the database.
 */
const getGenesQuery = gql`
    ${GENE_FIELDS}
    query getAllGenes {
        genes(all: true) {
            ...GeneFields
        }
    }
`;

/**
 * @param {number} geneId - gene id for which the data is needed.
 * @returns - the information for the queried gene.
 */
const getGeneQuery = gql`
    ${GENE_FIELDS}
    query getSingleGene($geneId: Int, $geneName: String) {
        gene(geneId: $geneId, geneName: $geneName) {
            ...GeneFields
        }
    }
`;

const getCompoundTargetsQuery = gql`
    query getCompoundTargets {
        compound_targets {
            compound_id
            targets {
                id
            }
        }
    }
`;

export { 
    getGenesQuery, 
    getGeneQuery, 
    getCompoundTargetsQuery 
};
