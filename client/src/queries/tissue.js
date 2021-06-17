import { gql } from 'apollo-boost';

/**
 * @param {boolean} all - takes a boolean value if to search all the genes or not.
 * @returns - Query returns the list of tissues with the id and name of a single tissue.
 */
const getTissuesQuery = gql`
  query getAllTissues {
    tissues(all: true) {
      id
      name
    }
  }
`;

/**
 * @param { number } tissueId - tissue id of the cell line to be queried.
 */
const getTissueQuery = gql`
  query getSingleTissue($tissueId: Int!) {
    tissue(tissueId: $tissueId) {
      id
      name
      synonyms {
        name
        source
      }
      cell_count {
        dataset {
          name
        }
        count
      }
      compounds_tested {
        dataset {
          name
          id
        }
        count
      }
    }
  }
`;

export {
  getTissuesQuery,
  getTissueQuery,
};
