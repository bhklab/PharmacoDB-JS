import { gql } from 'apollo-boost';


/**
 * @param {number} compoundId - compound id of the compound to be queried.
 * @returns - Query returns an object for the compound target based on the compound id.
 */
const getCompoundTarget = gql`
    query getCompoundTarget($compoundId: Int, $compoundName: String) {
        compound_target(compoundId: $compoundId, compoundName: $compoundName) {
            compound_id,
            compound_name,
            targets {
                id
                name
            }
        }
    }
`;

const getGeneCompountTarget = gql`
    query getGeneCompoundTarget($compoundId: Int, $compoundName: String) {
        gene_compound_target(compoundId: $compoundId, compoundName: $compoundName) {
            compound_id,
            compound_name,
            targets {
                id
                name
                gene {
                    id
                    name
                    annotation {
                        symbol
                    }
                }
            }
        }
    }  
`;

const getCompountsGeneTarget = gql`
    query getCompountsGeneTarget($geneId: Int, $geneName: String) {
        compounds_gene_target(geneId: $geneId, geneName: $geneName) {
            gene {
                id
                name
                annotation {
                    symbol
                }
            }
            compounds {
                compound_id,
                compound_name,
                compound_uid,
                targets  {
                        id,
                        name
                }
            }
        }
    }  
`;

export {
    getCompoundTarget,
    getGeneCompountTarget,
    getCompountsGeneTarget
};
