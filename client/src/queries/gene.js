import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of genes with the id and name of the gene
 * and also returning the annotation object for each of the gene in the database.
 */
const getGenesQuery = gql`
  query getAllGenes {
    genes {
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
};
