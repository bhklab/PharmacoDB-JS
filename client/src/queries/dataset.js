import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of datasets with information about how many
 * cell lines, tissues, experiments and compounds are in those datsets.
 */
const getDatasetCountsQuery = gql`
  query getDatasetData {
    datasets {
      id
      name
      cell_count
      experiment_count
      compound_tested_count
      tissue_tested_count
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
    dataset(datasetId: $datasetId) {
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
        name
      }
    }
  }
`;

const getCountTypePerDatasetQuery = gql`
  query getCountTypePerDatasetQuery ($type: String!){
    typeCountGroupByDataset (type: $type) {
      dataset {
        id
        name
      },
      count
    }
  }
`;

export {
  getDatasetCountsQuery,
  getDatasetsQuery,
  getDatasetQuery,
  getCellLinesGroupedByDatasetQuery,
  getDatasetCellLinesQuery,
  getDatasetCompoundQuery,
  getCountTypePerDatasetQuery
};
