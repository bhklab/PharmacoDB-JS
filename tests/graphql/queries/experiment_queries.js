/**
 * Experiment Queries to be used for graphql.test.js
 */

const singleExperimentTestQuery = `
  {
    experiment(experimentId: 1) {
      id
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      }
      compound {
        id
        name
        annotation {
          smiles
          inchikey
          pubchem
          fda_status
        }
      }
      tissue {
        id
        name
      },
      dataset {
        id
        name
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
      dose_responses {
        dose
        response
      }
    }
  }
`;
const multipleExperimentsTestQuery = `
  {
    experiments(page:1, per_page: 50) {
      id
      cell_line {
        id
        name
        tissue {
          id
          name
        }
      }
      compound {
        id
        name
        annotation {
            smiles
            inchikey
            pubchem
            fda_status
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
        HS
        Einf
        EC50
        AAC
        IC50
        DSS1
        DSS2
        DSS3
      }
      dose_responses {
        dose
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
        id
        name
      }
      dataset {
        id
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
      profile {
        IC50
        AAC
      }
    }
  }
`;

module.exports = {
    singleExperimentTestQuery,
    multipleExperimentsTestQuery,
    singleCompoundExperimentsTestQuery
};