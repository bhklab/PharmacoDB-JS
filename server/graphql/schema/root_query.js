// root query for the schema definition.
const RootQuery = `type RootQuery {
    "Root Queries for compounds."
    compounds: [Compound!]!
    compound(compoundId: Int!): Compound!

    "Root Queries for cell lines."
    cell_lines: [CellLine!]!

    "Root Queries for datasets."
    datasets: [Dataset!]!

    "Root Queries for tissues."
    tissues: [Tissue!]!

    "Root Queries for genes."
    genes: [Gene!]!
    gene(geneId: Int!): Gene!
}`;

module.exports = {
    RootQuery
};
