import { gql } from 'apollo-boost';

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
  getDatasetsQuery,
};
