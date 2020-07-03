import { gql } from 'apollo-boost';

/**
 * Query returns the list of compounds with the id and name.
 */
const getCompoundsQuery = gql`
    {
        compounds {
            id
            name
        }
    }
`;

const disableDrug = gql`
  {
    drug @client
  }
`;

export {
  getCompoundsQuery,
  disableDrug,
};
