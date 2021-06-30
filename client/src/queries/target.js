import { gql } from 'apollo-boost';


/**
 * @param {number} compoundId - compound id of the compound to be queried.
 * @returns - Query returns an object for the compound target based on the compound id.
 */
const getCompoundTarget = gql`
    query getCompoundTarget($compoundId: Int!) {
        conpound_target(compoundId: $compoundId) {
            compound_id,
            compound_name,
            targets {
                id
                name
            }
        }
    }
`;

export {
    getCompoundTarget,
};
