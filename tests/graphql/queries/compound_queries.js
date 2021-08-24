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
        compound(compoundName: "Lapatinib") {
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
              source {
                    id,
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

const paclitaxelCompoundTestQuery = `
    {
        compound(compoundName: "paclitaxel") {
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
