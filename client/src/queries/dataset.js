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

export {
  getDatasetCountsQuery,
  getDatasetsQuery,
};
