const {
    buildSchema
} = require('graphql');

module.exports = buildSchema(`
    type Compound {
        id: Int!
        name: String!
    }

    type RootQuery {
        compounds: [Compound!]!
        compound(compoundId: Int!): Compound!
    }

    schema {
        query: RootQuery
    }
`);