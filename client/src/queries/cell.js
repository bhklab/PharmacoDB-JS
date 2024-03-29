import { gql } from 'apollo-boost';

/**
 * @returns - Query returns the list of cell lines with it's id and name,
 * and also returns the tissue object for the particular cell line.
 */
const getCellLinesQuery = gql`
  query getAllCellLines {
    cell_lines(all: true) {
      id
      uid
      name
      tissue {
        id
        name
      }
      datasets {
        id
        name
      }
    }
  }
`;

/**
 * @param { Number } cellId - cell id of the cell line to be queried.
 * @returns - all the information returns by the cell lines query,
 * diseases, accessions, and synonym for the cell line in different datasets.
 */
const getCellLineQuery = gql`
  query getSingleCellLine($cellId: Int, $cellName: String, $cellUID: String) {
    cell_line(cellId: $cellId, cellName: $cellName, cellUID: $cellUID) {
      id
      uid
      name
      diseases
      accession_id
      tissue {
        id
        name
      }
      synonyms {
        name
        dataset {
          id
          name
        }
      }
    }
  }
`;

export {
  getCellLinesQuery,
  getCellLineQuery,
};
