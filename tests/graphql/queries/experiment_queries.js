/**
 * Experiment Queries to be used for graphql.test.js
 */

const singleExperimentKeysTestQuery = `
  {
    experiment(experimentId: 1) {
      id,
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      },
      compound {
        id,
        name,
        annotation {
          smiles,
          inchikey,
          pubchem,
          fda_status
        }
      }
      tissue {
        id,
        name
      },
      dataset {
        id,
        name
      },
      dose_responses {
        dose,
        response
      }
    }
  }
`;

const experimentsKeysTestQuery = `
  
`;

module.exports = {
    singleExperimentKeysTestQuery
};