const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Compound {
        id: Int!
        name: String!
        annotation: CompoundAnnotation! # to-one
    }

    type CompoundAnnotation {
        drug_id: Int!
        smiles: String
        inchikey: String
        pubchem: String
    }

    type RootQuery {
        compounds: [Compound!]!
        compound(compoundId: Int!): Compound!
    }

    schema {
        query: RootQuery
    }
`);
