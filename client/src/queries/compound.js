import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of compounds with the id and name of the compound
 * and returning the annotation object for each of the compound in the database.
 */
const getCompoundsQuery = gql`
  query getAllCompounds {
    compounds(all: true) {
      id
      name
      annotation {
        smiles
        inchikey
        pubchem
        fda_status
      }
    }
  }
`;

/**
 * @param { Number } compoundId - takes the compound id as the argument to the query.
 * @returns - Query returns info of compound object for the given id and
 * also returns all the synonyms for that compound in different datasets
 * and also providing the target object.
 */
const getCompoundQuery = gql`
  query getSingleCompound($compoundId: Int!) {
    compound(compoundId: $compoundId) {
      compound {
        id
        name
        annotation {
          smiles
          inchikey
          pubchem
          fda_status
        }
      }
      synonyms {
        name
        source
      }
      targets {
        id
        name
      }
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
