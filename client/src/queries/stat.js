import { gql } from 'apollo-boost';


/**
 * @returns - 
 */
const getAllDataTypeStatsQuery = gql`
    query allDataTypeStats {
        data_type_stats {
            dataType
            count
        }
    }
`;

export {
    getAllDataTypeStatsQuery,
};
