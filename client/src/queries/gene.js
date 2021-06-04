import { gql } from 'apollo-boost';

/**
 * @param {boolean} all - takes a boolean value if to search all the genes or not.
 * @returns - Query returns the list of genes with the id and name of the gene
 * and also returning the annotation object for each of the gene in the database.
 */
const getGenesQuery = gql`
  query getAllGenes {
    genes(all: true) {
      id
      name
      annotation {
        ensg
        gene_seq_start
        gene_seq_end
        
      }
    }
  }
`;

/**
 * @param { Number } geneID - gene id of the gene to be queried.
 * @returns - all the information returns by the gene query
 */
const getGeneQuery = gql`
  query getSingleGene($geneId: Int!) {
    gene(geneId: $geneId) {
      id
      name
      annotation {
        ensg
        gene_seq_start
        gene_seq_end
      }
    }
  }
`;

export {
  getGenesQuery,
  getGeneQuery,
};
