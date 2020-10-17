import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of cell lines with it's id and name,
 * and also returns the tissue object for the particular cell line.
 */
const getCellLinesQuery = gql`
  query getAllCellLines {
    cell_lines(all: true) {
      id
      name
      tissue {
        id
        name
      }
    }
  }
`;

/**
 * @param { Number } cellId - cell id of the cell line to be queried.
 * @returns - all the information returns by the cell lines query
 * and synonym for the cell line in different datasets.
 */
const getCellLineQuery = gql`
  query getSingleCellLine($cellId: Int!) {
    cell_line(cellId: $cellId) {
      id
      name
      tissue {
        id
        name
      }
      synonyms {
        name
        source
      }
    }
  }
`;

export {
  getCellLinesQuery,
  getCellLineQuery,
};
