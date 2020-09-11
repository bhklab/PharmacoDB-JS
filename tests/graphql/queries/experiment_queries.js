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
const singleCompoundExperimentsTestQuery = `
  {
    experiments(compoundId: 1) {
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
        id,
        name
      }
      dataset {
        id,
        name
      }
    	compound {
        id
        name
        annotation {
          pubchem
          smiles
          fda_status
          inchikey
        }
      }
    }
  }
`;

module.exports = {
    singleExperimentTestQuery,
    multipleExperimentsTestQuery,
    singleCompoundExperimentsTestQuery
};