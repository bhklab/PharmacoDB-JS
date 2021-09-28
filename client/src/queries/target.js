import { gql } from 'apollo-boost';


const getSingleCompoundTarget = gql`
    query getSingleCompoundTarget($compoundId: Int, $compoundName: String) {
        single_compound_target(compoundId: $compoundId, compoundName: $compoundName) {
            compound_id
            compound_name
            compound_uid
            targets {
                target_id
                target_name
                genes {
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


const getSingleGeneTarget = gql`
    query getSingleGeneTarget($geneId: Int, $geneName: String) {
        single_gene_target(geneId: $geneId, geneName: $geneName) {
            gene_id
            gene_name
            gene_annotation {
                symbol
            }
            targets {
                target_id
                target_name
                compounds {
                    id
                    name
                    uid
                }
            }
        }
    }  
`;


const getAllCompoundTargetsQuery = gql`
    query getAllCompoundTargets {
        all_compound_targets {
            compound_id
            targets {
                target_id
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
    getSingleCompoundTarget,
    getSingleGeneTarget,
    getAllCompoundTargetsQuery,
    getGeneTargetCountCompoundsByDataset,
};
