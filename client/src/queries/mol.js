import { gql } from 'apollo-boost';

/**
 * @param { number } cellLineId - takes the cellLine id or cellLine name as the argument to the query.
 * @returns - Query returns info of datasets id and names, molecular data type, and number of profiles
 * for the given cellLine id or name
 */
const getMolCellQuery = gql`
  query getSingleMolCell($cellLineId: Int, $cellLineName: String) {
    mol_cell(cellLineId: $cellLineId, cellLineName: $cellLineName) {
      dataset_id
      dataset_name
      mDataType
      num_prof
    }
  }
`;

export {
    getMolCellQuery,
};
