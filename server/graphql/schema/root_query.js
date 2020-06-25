// root query for the schema definition.
const RootQuery = `type RootQuery {
    "Root Queries for compounds."
    compounds(page: Int, per_page: Int, all: Boolean): [Compound!]!
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

    "Roor Queries for experiments."
    experiments: [Experiment!]!
}`;

module.exports = {
    RootQuery
};
