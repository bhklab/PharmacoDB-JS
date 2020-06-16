const { buildSchema } = require('graphql');
const { compoundType, compoundAnnotationType } = require('./compound');

// root query for the schema definition.
const RootQuery = `type RootQuery {
    compounds: [Compound!]!
    compound(compoundId: Int!): Compound!
}`;

// schema definition.
const schema = `
    "Compound Type with id, name and annotations"
    ${compoundType}

    "Compound Annotation Type with drug id, smiles, inchikey and pubchem"
    ${compoundAnnotationType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
