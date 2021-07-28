/**
 *  Dataset Queries to be used for graphql.test.js
 */

const multipleDatasetsTestQuery = `
  query allDatasets {
    datasets {
      id
      name
      compound_tested_count
      cell_count
      experiment_count
    }
  }
`;

const singleDatasetTestQuery = `
query singleDataset {
  dataset(datasetId: 2) {
    id
    name
    cell_count
    tissue_tested_count
    compound_tested_count
    experiment_count
    cells_tested {
      id
      name
    }
    compounds_tested {
      id
      name
    }
  }
}
`;

module.exports = {
    multipleDatasetsTestQuery,
    singleDatasetTestQuery
};