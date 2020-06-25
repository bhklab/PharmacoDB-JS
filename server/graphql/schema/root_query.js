// root query for the schema definition.
const RootQuery = `type RootQuery {
    "Root Queries for compounds."
    compounds(page: Int, per_page: Int, all: Boolean): [Compound!]!
    compound(compoundId: Int!): Compound!

    "Root Queries for cell lines."
    cell_lines: [CellLine!]!
    cell_line(cellId: Int!): CellLineAnnotation!

    "Root Queries for datasets."
    datasets: [Dataset!]!
    dataset(datasetId: Int!): Dataset!

    "Root Queries for tissues."
    tissues: [Tissue!]!
    tissue(tissueId: Int!): TissueAnnotation!

    "Root Queries for genes."
    genes: [Gene!]!
    gene(geneId: Int!): Gene!

    "Roor Queries for experiments."
    experiments: [Experiment!]!
}`;

module.exports = {
    RootQuery
};
