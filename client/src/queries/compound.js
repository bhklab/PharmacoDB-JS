import { gql } from 'apollo-boost';


/**
 * @returns - ids and names of all the compounds
 */
const getCompoundsIdNameQuery = gql`
  query getAllCompoundsIdName {
    compounds(all: true) {
      id
      name
    }
  }
`;

/**
 * @param {boolean} all - takes a boolean value if to search all the compounds or not.
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
        chembl
        fda_status
      }
    }
  }
`;

/**
 * @param { number } compoundId - takes the compound id as the argument to the query.
 * @returns - Query returns info of compound object for the given id and
 * also returns all the synonyms for that compound in different datasets
 * and also providing the target object.
 */
const getCompoundQuery = gql`
  query getSingleCompound($compoundId: Int, $compoundName: String) {
    singleCompound: compound(compoundId: $compoundId, compoundName: $compoundName) {
      compound {
        id
        name
        annotation {
          smiles
          inchikey
          pubchem
          fda_status
          chembl
        }
      }
      synonyms {
        name
        source {
          id
          name
        }
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
  getCompoundsIdNameQuery,
};
