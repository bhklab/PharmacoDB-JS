/**
 * Experiment Queries to be used for graphql.test.js
 */

const singleExperimentTestQuery = `
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

const multipleExperimentsTestQuery = `
  {
    experiments(page:1, per_page: 50) {
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

module.exports = {
    singleExperimentTestQuery,
    multipleExperimentsTestQuery
};