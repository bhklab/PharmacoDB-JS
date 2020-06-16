const { buildSchema } = require('graphql');
const { compoundType, compoundAnnotationType } = require('./compound');
const { cellLineType } = require('./cell');

// root query for the schema definition.
const RootQuery = `type RootQuery {
    compounds: [Compound!]!
    compound(compoundId: Int!): Compound!
    cell_lines: [CellLine!]!
}`;

// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}

    "Compound Annotation Type with drug id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
