import { gql } from 'apollo-boost';

// Fragment containing the gene id, name and annotation.
// This fragment is currently not used due to some issues, maybe removed from the code base.
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
 * @returns the ids and symbols for all the genes in the dataset.
 */
const getGenesIdSymbolQuery = gql`
  query getAllGeneIdSymbols {
      genes(all: true) {
          id
          annotation {
              symbol
          }
      }
  }
`;

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
                gene_id
                symbol
                gene_seq_start
                gene_seq_end
                chr
                strand
            }
        }
    }
`;

/**
 * @param {number} geneId - gene id for which the data is needed.
 * @returns - the information for the queried gene.
 */
const getGeneQuery = gql`
    query getSingleGene($geneId: Int, $geneName: String) {
        gene(geneId: $geneId, geneName: $geneName) {
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
    }
`;


export {
    getGenesQuery,
    getGeneQuery,
    getGenesIdSymbolQuery,
};
