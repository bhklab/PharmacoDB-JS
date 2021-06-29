/**
 * Compound Queries to be used for graphql.test.js
 */

const multipleCompoundsTestQuery = `
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

// using compoundId 13 since it has all annotation fields present and has at least one target
const singleCompoundTestQuery = `
    { 
        compound(compoundId: 13) {
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

const paclitaxelCompoundTestQuery = `
    {
        compound(compoundId: 641) {
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
    multipleCompoundsTestQuery,
    singleCompoundTestQuery,
    paclitaxelCompoundTestQuery,
};
