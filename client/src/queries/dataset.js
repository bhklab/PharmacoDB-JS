import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of datasets with information about how many
 * cell lines, tissues, experiments and compounds are in those datsets.
 */
const getDatasetCountsQuery = gql`
  query getDatasetCounts {
    dataset(datasetId: 1) {
      id
      name
      cell_count
      tissue_tested_count
      experiment_count
      compound_tested_count
    }
  }
`;

export {
  getDatasetCountsQuery,
};
