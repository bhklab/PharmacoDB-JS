const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Compound {
        id: Int!
        name: String!
    }

    type RootQuery {
        compounds: [Compound!]!
    }

    schema {
        query: RootQuery
    }
`);