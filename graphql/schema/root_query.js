// root query for the schema definition.
const RootQuery = `type RootQuery {
    "Root Queries for compounds."
    compounds(page: Int, per_page: Int, all: Boolean): [Compound!]!
    compound(compoundId: Int!): SingleCompound!

    "Root Queries for cell lines."
    cell_lines: [CellLine!]!
    cell_line(cellId: Int!): CellLineAnnotation!

    "Root Queries for datasets."
    datasets: [Dataset!]!
    dataset(datasetId: Int!): [DatasetInformation!]!
    cell_lines_per_dataset: [Count!]!
    "arguments that can be passed: 'cell', 'tissue', 'drug'"
    type_tested_on_dataset(type: AllowedValues!, datasetId: Int!): Summary!

    """Root Queries for experiments.
    'page' is the page number for output (default value is 1)'.
    'per_page' is the number of items returned per page (default value is 30)'.
    If 'all' flag set to true, the API return all available data (default value is false)"""
    experiments(page: Int, per_page: Int, all: Boolean): [Experiment!]!
    experiment(experimentId: Int!): Experiment!

    "Root Queries for genes."
    genes: [Gene!]!
    gene(geneId: Int!): Gene!

    "Root Queries for sources"
    sources: [Source!]!
    source_stats: [SourceStats!]!

    "Root Queries for targets."
    compound_target(compoundId: Int!): CompoundTarget!

    "Root Queries for tissues."
    tissues: [Tissue!]!
    tissue(tissueId: Int!): TissueAnnotation!

    "Root Queries for gene_drugs."
    gene_drugs(geneId: Int, compoundId: Int, page: Int, per_page: Int, all: Boolean): [GeneDrug!]!
}`;

module.exports = {
    RootQuery
};