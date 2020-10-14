// root query for the schema definition.
const RootQuery = `type RootQuery {

    """Root Query for compounds.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)"""
    compounds(page: Int, per_page: Int, all: Boolean): [Compound!]!

    """Root Query to get a single compound detail.
        'compoundId' is the id of the compound in the database and is an optional field.
        'compoundName' is the name of the compound in the database and is also an optional field.
        One of the parameters has to be passed either an Id or the compound Name"""
    compound(compoundId: Int, compoundName: String): CompoundDetail!

    """Root Query for cell lines.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)"""
    cell_lines(page: Int, per_page: Int, all: Boolean): [CellLine!]!

    """Root Query to get a single cell detail.
        'cellId' is the id of the cell in the database and is an optional field.
        'cellName' is the name of the cell in the database and is also an optional field.
        One of the parameters has to be passed either an Id or the cell Name"""
    cell_line(cellId: Int, cellName: String): CellLineDetail!

    "Root Queries for datasets."
    datasets: [Dataset!]!
    dataset(datasetId: Int!): [DatasetDetail!]!
    cell_lines_per_dataset: [Count!]!
    "arguments that can be passed: 'cell', 'tissue', 'drug'"
    type_tested_on_dataset(type: AllowedValues!, datasetId: Int!): Summary!

    """Root Queries for experiments.
    'page' is the page number for output (default value is 1)'.
    'per_page' is the number of items returned per page (default value is 30)'.
    If 'all' flag set to true, the API return all available data (default value is false)"""
    experiments(compoundId: Int, page: Int, per_page: Int, all: Boolean): [Experiment!]!
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
    tissue(tissueId: Int!): TissueDetail!

    "Root Queries for gene_drugs."
    gene_drugs(geneId: Int, compoundId: Int, page: Int, per_page: Int, all: Boolean): [GeneDrug!]!
}`;

module.exports = {
    RootQuery
};