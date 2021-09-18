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

const getGeneCompoundTarget = gql`
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

const getCompoundsGeneTarget = gql`
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

const getGeneTargetCountCompoundsByDataset = gql`
    query getGeneTargetCountCompoundByDataset($geneId: Int, $geneName: String) {
        single_gene_targets_group_by_dataset(geneId: $geneId, geneName: $geneName) {
            gene_id,
            gene_name,
            targetsStat
                {
                  dataset {
                            id 
                            name
                            }
                compound_count
                }
        }
    }   
`;

export {
    getCompoundTarget,
    getGeneCompoundTarget,
    getCompoundsGeneTarget,
    getGeneTargetCountCompoundsByDataset,
};
