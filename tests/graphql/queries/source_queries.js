/**
 * Source Queries to be used for graphql.test.js
 */

const allSourcesTestQuery = `
  query getSources {
    sources {
      id
      name
      dataset {
        id
        name
      }
    }
  }
`;

module.exports = {
    allSourcesTestQuery
};