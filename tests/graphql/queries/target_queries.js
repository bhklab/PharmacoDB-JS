/**
 * Target Queries to be used for graphql.test.js
 */


// some drugs have not matching targets in the database
// used drug with compound_id 13 since it has multiple targets
const targetTestQuery = `
  {
    compound_target(compoundId: 13) {
      compound_id
      compound_name
      targets {
        id
        name
      }
    }
  }
`;

module.exports = {
    targetTestQuery
};