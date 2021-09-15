// root query for the schema definition.
const RootQuery = `type RootQuery {

    """
        Root Query for compounds.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)
    """
    compounds(page: Int, per_page: Int, all: Boolean): [Compound!]!

    """
        Root Query to get a single compound detail.
        'compoundId' is the id of the compound in the database and is an optional field.
        'compoundName' is the name of the compound in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the compound Name
    """
    compound(compoundId: Int, compoundName: String, compoundUID: String): CompoundDetail!


    """
        Root Query for cell lines.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)
    """
    cell_lines(page: Int, per_page: Int, all: Boolean): [CellLine!]!

    """
        Root Query to get a single cell detail.
        'cellId' is the id of the cell in the database and is an optional field.
        'cellName' is the name of the cell in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the cell Name
    """
    cell_line(cellId: Int, cellName: String, cellUID: String): CellLineDetail!


    """
        Root Query for datasets
    """
    datasets: [Dataset!]!

    """
        Root Query to get a single dataset detail.
        'datasetId' is the id of the dataset in the database and is an optional field.
        'datasetName' is the name of the dataset in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the dataset Name
    """
    dataset(datasetId: Int, datasetName: String): [DatasetDetail!]!
    
    """
        Root Query for Counting tested Types for each dataset
    """
    dataset_stats: [DatasetStats!]!

    """
        Root Query for returning tested Types for all datasets
    """
    datasets_types: [DatasetsTypes!]!
    
    """
        This is a query to get the cell lines that are grouped based on the dataset.
    """
    cell_lines_grouped_by_dataset: [Summary!]!

    """
        arguments that can be passed: 'cell', 'tissue', 'drug'
    """
    type_tested_on_dataset_summary(type: AllowedValues!, datasetId: Int!): Summary!


    """
        Root Queries for experiments.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)
    """
    experiments(cellLineId: Int, cellLineName: String, compoundId: Int, compoundName: String, tissueId: Int, tissueName: String, page: Int, per_page: Int, all: Boolean): [Experiment!]!
    experiment(experimentId: Int!): Experiment!


    """
        Root Query for genes.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)
    """
    genes(page: Int, per_page: Int, all: Boolean): [Gene!]!

    """Root Query to get a single gene detail.
        'geneId' is the id of the gene in the database and is an optional field.
        'geneName' is the name of the gene in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the gene Name"""
    gene(geneId: Int, geneName: String): Gene!


    """
        Root Queries for gene_compound tables.
    """
    gene_compound_tissue(geneId: Int, geneName: String, compoundId: Int, compoundName: String, tissueId: Int, tissueName: String, page: Int, per_page: Int, all: Boolean): [GeneCompoundTissue!]!
    gene_compound_dataset(geneId: Int, geneName: String, compoundId: Int, compoundName: String, page: Int, per_page: Int, all: Boolean): [GeneCompoundDataset!]!
    gene_compound_tissue_dataset(geneId: Int, compoundId: Int, tissueId: Int, geneName: String, compoundName: String, tissueName: String, mDataType: String, page: Int, per_page: Int, all: Boolean): [GeneCompoundTissueDataset!]!
    gene_compound_dataset_biomarker(compoundId: Int, compoundName: String, mDataType: String, page: Int, per_page: Int, all: Boolean): [GeneCompoundDataset!]!
    gene_compound_tissue_dataset_biomarker(compoundId: Int, tissueId: Int, compoundName: String, tissueName: String, mDataType: String, page: Int, per_page: Int, all: Boolean): [GeneCompoundTissueDataset!]!

    """
        Root Queries for targets.
    """
    compound_target(compoundId: Int!): CompoundTarget!
    compound_targets(page: Int, per_page: Int, all: Boolean): [CompoundTarget]

    """
        Root Query for the stats for the different types.
    """
    data_type_stats: [Statistics!]!

    """
        Root Query for tissues.
        'page' is the page number for output (default value is 1)'.
        'per_page' is the number of items returned per page (default value is 30)'.
        If 'all' flag set to true, the API return all available data (default value is false)
    """
    tissues(page: Int, per_page: Int, all: Boolean): [Tissue!]!

    """
        Root Query to get a single tissue detail.
        'tissueId' is the id of the tissue in the database and is an optional field.
        'tissueName' is the name of the tissue in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the tissue Name
    """
    tissue(tissueId: Int, tissueName: String): TissueDetail!
    
        """
        Root Query to get a mol cell detail.
        'cellId' is the id of the cell in the database and is an optional field.
        'cellName' is the name of the cell in the database and is also an optional field.
        One of the parameters has to be passed either an ID or the cell Name
    """
    mol_cell(cellLineId: Int, cellLineName: String): [Mol]!
}`;

module.exports = {
    RootQuery
};
