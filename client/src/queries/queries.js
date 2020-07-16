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

/**
 * Query returns info of compound given the id.
 */
const getCompoundQuery = gql`
 query Compound($compoundId: Int!) {
    compound(compoundId: $compoundId) {
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
  getCompoundQuery,
  disableDrug,
};
