/**
 * Compound Queries to be used for graphql.test.js
 */

const compoundsKeysTestQuery = `
    { 
        compounds { 
            id 
            name 
        } 
    }
`;

const compoundKeysTestQuery = `
    { 
        compound(compoundId: 1) {
            compound {
                id 
                name 
                annotation {
                    smiles
                    inchikey
                    pubchem
                }
            } 
        } 
    }
`;

const compoundQueryPaclitaxel = `
    {
        compound(compoundId: 526) {
            compound {
                id 
                name 
                annotation {
                    smiles
                    inchikey
                    pubchem
                }
            } 
        }
    }
`;

module.exports = {
    compoundsKeysTestQuery,
    compoundKeysTestQuery,
    compoundQueryPaclitaxel
};
