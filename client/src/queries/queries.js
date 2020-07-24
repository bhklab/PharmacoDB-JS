import { gql } from 'apollo-boost';

/**
 * Query returns the list of compounds with the id and name.
 */
const getCompoundsQuery = gql`
    {
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
 * Query returns info of compound given the id.
 */
const getCompoundQuery = gql`
query getCompound($compoundId: Int!) {
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
