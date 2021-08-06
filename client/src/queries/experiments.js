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

export {
  getSingleCompoundExperimentsQuery,
  getSingleCellLineExperimentsQuery,
  getSingleTissueExperimentsQuery,
  getSingleTissueCellLinesQuery,
  getSingleTissueCompoundsQuery,
  getSingleGeneExperimentsQuery
};
