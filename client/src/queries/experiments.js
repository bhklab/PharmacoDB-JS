/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';

/**
 * @param { Number } compoundId - takes the compound id as the argument to the query.
 * @returns - Query returns all experiments for the given compound.
 */
const getSingleCompoundExperimentsQuery = gql`
  query getSingleCompoundExperiments($compoundId: Int!) {
    experiments(compoundId: $compoundId) {
      id
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      }
      tissue {
        id
        name
      }
      dataset {
        id
        name
      }
      profile {
        AAC
        IC50
      }
    }
  }
`;

export {
  getSingleCompoundExperimentsQuery,
};
