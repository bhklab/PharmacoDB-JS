/**
 * Gene Queries to be used for graphql.test.js
 */

const geneKeysTestQuery = `
  {
    gene(geneId: 1) {
      id,
      name,
      annotation {
        gene_id,
        ensg,
        gene_seq_start,
        gene_seq_end
      }
    }
  }
`;

const genesKeysTestQuery = `
    {
      genes {
        id,
        name,
        annotation {
          gene_id,
          ensg,
          gene_seq_start,
          gene_seq_end
        }
      }
    }
`;

module.exports = {
    geneKeysTestQuery,
    genesKeysTestQuery,
};
