// root query for the schema definition.
const RootQuery = `type RootQuery {
    compounds: [Compound!]!
    compound(compoundId: Int!): Compound!
    cell_lines: [CellLine!]!
    datasets: [Dataset!]!
    tissues: [Tissue!]!
    genes: [Gene!]!
    gene(geneId: Int!): Gene!
}`;

module.exports = {
    RootQuery
};
