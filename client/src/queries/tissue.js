import { gql } from 'apollo-boost';

const getTissuesQuery = gql`
  query getAllTissues {
    tissues(all: true) {
      id
      name
    }
  }
`;

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
