/**
 * Source Queries to be used for graphql.test.js
 */

const multipleSourcesTestQuery = `
  query getSources {
    sources {
      id
      name
      dataset {
        id
        name
      }
    }
  }
`;

const sourceStatsTestQuery = `
  query getSourceStats {
    source_stats {
      source_id
      source_name
      cell_line_count
      tissue_count
      compound_count
      experiment_count
    }
  }
`;


module.exports = {
    multipleSourcesTestQuery,
    sourceStatsTestQuery
};