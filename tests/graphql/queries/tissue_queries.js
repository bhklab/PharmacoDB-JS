/**
 * Tissue Queries to be used for graphql.test.js
 */

const multipleTissuesTestQuery = `
  {
    tissues {
      id
      name
    }
  }
`;

const singleTissueTestQuery = `
  {
    tissue(tissueId: 7) {
      id
      name
      synonyms {
        name
        source {
          id
          name
        }
      }
      cell_count {
        dataset {
          id
          name
        }
        count
      }
      compounds_tested {
        dataset {
          id
          name
        }
        count
      }
    }
  }
`;

module.exports = {
    singleTissueTestQuery,
    multipleTissuesTestQuery
};
