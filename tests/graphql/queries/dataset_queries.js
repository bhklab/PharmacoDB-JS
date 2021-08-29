/**
 *  Dataset Queries to be used for graphql.test.js
 */

const multipleDatasetsTestQuery = `
  query allDatasets {
    datasets {
      id
      name
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

const allDatasetsStatsTestQuery = `
query datasetStats {
    dataset_stats {
      dataset {
        id,
        name
      }
      cell_line_count
      experiment_count
      compound_count
      tissue_count
    }
  }
`;

module.exports = {
    multipleDatasetsTestQuery,
    singleDatasetTestQuery,
    allDatasetsStatsTestQuery,
};
