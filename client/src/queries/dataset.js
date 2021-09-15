import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of datasets with information about how many
 * cell lines, tissues, experiments and compounds are in those datsets.
 */
const getDatasetStatsQuery = gql`
  {
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

/**
 * @returns - Query returns the list of datasets with the id and name of the dataset.
 */
const getDatasetsQuery = gql`
  query getAllDatasets {
    datasets {
      id
      name
    }
  }
`;

/**
 * @param { Number } datasetId - dataset id of the dataset to be queried.
 * @returns - all the information returns by the dataset query,
 * id, and name for the dataset.
 */
const getDatasetQuery = gql`
  query getSingleDataset($datasetId: Int!, $datasetName: String!) {
    dataset(datasetId: $datasetId, datasetName: $datasetName) {
      id
      name
    }
  }
`;

/**
 * @returns - The query returns an Array of object with the dataset object, count, type
 * and an array of objects containing the id and name of the cell lines belonging to that dataset.
 */
const getCellLinesGroupedByDatasetQuery = gql`
  query getCellLinesGroupedByDataset {
    cell_lines_grouped_by_dataset {
      dataset {
        id
        name
      }
      count
      type
      list {
        id
        name
      }
    }
  }
`;

const getDatasetCellLinesQuery = gql`
  query getDatasetCellLinesQuery($datasetId: Int!) {
    dataset(datasetId: $datasetId) {
      id,
      name,
      cells_tested {
        id
        cell_uid
        name
      }
    }
  }
`;

const getDatasetTestedCellsQuery = gql`
  query getDatasetTestedCellsQuery($datasetId: Int!) {
    dataset_type(datasetId: $datasetId) {
      dataset {
        id
        name
      }
      cells_tested {
        id
        cell_uid
        name
      }
    }
  }
`;

const getDatasetCompoundQuery = gql`
  query getDatasetCompoundQuery($datasetId: Int!) {
    dataset(datasetId: $datasetId) {
      id,
      name,
      compounds_tested {
        id
        uid
        name
      }
    }
  }
`;

const getDatasetTestedCompoundsQuery = gql`
  query getDatasetTestedCompoundQuery($datasetId: Int!) {
    dataset_type(datasetId: $datasetId) {
      dataset {
        id
        name
      }
      compounds_tested {
        id
        uid
        name
      }
    }
  }
`;

/**
 * @returns - Query returns the list of datasets with information about how many
 * cell lines, tissues, experiments and compounds are in those datsets.
 */
const getDatasetsTypesQuery = gql`
  {
    datasets_types {
      dataset {
        id
        name
      }
      tissues_tested {
        id
        name
      }
      cells_tested {
        id
        cell_uid
        name
      }
      compounds_tested {
        id
        uid
        name
      }
    }
  }
`;

export {
  getDatasetStatsQuery,
  getDatasetsQuery,
  getDatasetQuery,
  getCellLinesGroupedByDatasetQuery,
  getDatasetTestedCompoundsQuery,
  getDatasetTestedCellsQuery,
  getDatasetCellLinesQuery,
  getDatasetCompoundQuery,
  getDatasetsTypesQuery,
};
