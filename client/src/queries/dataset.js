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
 * @returns - The query returns an Array of object with the dataset object, count, type 
 * and an array of objects containing the id and name of the cell lines belonging to that dataset.
 */
const getCellLinesGroupedByDataset = gql`
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
`;



export {
  getDatasetCountsQuery,
  getDatasetsQuery,
  getCellLinesGroupedByDataset
};
