/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';

/**
 * @param { Number } compoundId - takes the compound id as the argument to the query.
 * @returns - Query returns all experiments for the given compound.
 */
const getSingleCompoundExperimentsQuery = gql`
  query getSingleCompoundExperiments($compoundId: Int!) {
    experiments(compoundId: $compoundId) {
      id
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      }
      tissue {
        id
        name
      }
      dataset {
        id
        name
      }
      profile {
        AAC
        IC50
      }
    }
  }
`;

/**
 * @param { Number } cellLineId - takes the cell line id as the argument to the query.
 * @returns - Query returns all experiments for the given cell line.
 */
const getSingleCellLineExperimentsQuery = gql`
  query getSingleCellLineExperiments($cellLineId: Int!) {
    experiments(cellLineId: $cellLineId) {
      id
      compound {
        id
        name
      }
      tissue {
        id
        name
      }
      dataset {
        id
        name
      }
      profile {
        AAC
        IC50
      }
    }
  }
`;

/**
 * @param { Number } tissueId - takes the tissue id as the argument to the query.
 * @returns - Query returns all experiments for the given tissue.
 */
const getSingleTissueExperimentsQuery = gql`
  query getSingleTissueExperiments($tissueId: Int!) {
    experiments(tissueId: $tissueId) {
      id
      compound {
        id
        name
      }
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      }
      dataset {
        id
        name
      }
      profile {
        AAC
        IC50
      }
    }
  }
`;

/**
 * @param { Number } tissueId - takes the tissue id as the argument to the query.
 * @returns - Query returns celllines used in all experiments for the given tissue.
 */
const getSingleTissueCellLinesQuery = gql`
query getSingleTissueCellLines($tissueId: Int!) {
  experiments(tissueId: $tissueId) {
    id
    cell_line {
      id
      name
    }
  }
}
`;

/**
 * @param { Number } tissueId - takes the tissue id as the argument to the query.
 * @returns - Query returns compounds used in all experiments for the given tissue.
 */
const getSingleTissueCompoundsQuery = gql`
  query getSingleTissueCompounds($tissueId: Int!) {
    experiments(tissueId: $tissueId) {
      id
      compound {
        id
        name
      }
      dataset {
      id
      name
    }
    }
  }
`;

// ToDO: gene drugs graphql request end point is not available.
const getSingleGeneExperimentsQuery = gql`
  query getSingleGeneExperiments($geneId: Int!) {
    gene_drugs(geneId: $geneId, all: true) {
      dataset {
        id
        name
      }
    }
  }
`;

/**
 * Takes cell line and compound ids/names, and returns all the experiment records that 
 * is performed using the given cell line and compound combination.
 * @param { String } cellLineUID
 * @param { Number } cellLineId 
 * @param { String } cellLineName
 * @param {String} compoundUID
 * @param { Number } compoundId
 * @param { String } compoundName
 * @returns - All the experiments with given cell line and compound combination.
 */
const getCellLineCompoundExperimentsQuery = gql`
  query getCellLineCompoundExperiments($cellLineId: Int, $cellLineName: String, $compoundId: Int, $compoundName: String) {
    experiments(
      cellLineId: $cellLineId, 
      cellLineName: $cellLineName, 
      compoundId: $compoundId, 
      compoundName: $compoundName, 
      all: true
    ) {
      cell_line {
        id
        name
      }
      compound {
        id
        name
      }
      dataset {
        id
        name
      }
      dose_response {
        dose
        response
      }
      profile {
        HS
        Einf
        EC50
        AAC
        IC50
        DSS1
        DSS2
        DSS3
      }
    }
  }
`;

const getTissueCompoundExperimentsQuery = gql`
  query getTissueCompoundExperiments($tissueId: Int, $tissueName: String, $compoundId: Int, $compoundName: String) {
    experiments(
      tissueId: $tissueId, 
      tissueName: $tissueName, 
      compoundId: $compoundId, 
      compoundName: $compoundName,
      all: true
    ) {
      tissue {
        id
        name
      }
      cell_line {
        id
        name
      }
      compound {
        id
        name
      }
      dataset {
        id
        name
      }
      dose_response {
        dose
        response
      }
      profile {
        HS
        Einf
        EC50
        AAC
        IC50
        DSS1
        DSS2
        DSS3
      }
    }
  }  
`;

export {
  getSingleCompoundExperimentsQuery,
  getSingleCellLineExperimentsQuery,
  getSingleTissueExperimentsQuery,
  getSingleTissueCellLinesQuery,
  getSingleTissueCompoundsQuery,
  getSingleGeneExperimentsQuery,
  getCellLineCompoundExperimentsQuery,
  getTissueCompoundExperimentsQuery
};
