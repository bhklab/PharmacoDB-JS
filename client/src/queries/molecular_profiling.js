import { gql } from 'apollo-boost';

/**
 * @param { number } cellLineId - takes the cellLine id or cellLine name as the argument to the query.
 * @returns - Query returns info of datasets id and names, molecular data type, and number of profiles
 * for the given cellLine id or name
 */
const getMolecularProfilingQuery = gql`
  query getSingleMolCell($cellLineId: Int, $cellLineName: String) {
    molecular_profiling(cellLineId: $cellLineId, cellLineName: $cellLineName) {
      dataset {
        id 
        name
      }
      mDataType
      num_prof
    }
  }
`;

export {
  getMolecularProfilingQuery,
};
