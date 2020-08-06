/**
 *  Dataset Queries to be used for graphql.test.js
 */

const datasetsKeysTestQuery = `
  query allDatasets {
    datasets {
      id
      name
    }
  }
`;

const datasetKeysTestQuery = `
query singleDataset() {
  dataset(datasetId: 2) {
    id
    name
    cell_count
    tissue_tested_count
    compound_tested_count
    experiment_count
    cells_tested
    compounds_tested
  }
}
`;

module.exports = {
    datasetsKeysTestQuery,
    datasetKeysTestQuery
};