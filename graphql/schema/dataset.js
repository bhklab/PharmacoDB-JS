const datasetType = `
    type Dataset {
        """id of the dataset in the database"""
        id: Int!
        """name of the dataset"""
        name: String!
    }
`;

const datasetDetailType = `
    type DatasetDetail {
        """id of the dataset"""
        id: Int!
        """name of the dataset"""
        name: String!
        """number of cell-lines in the dataset"""
        cell_count: Int!
        """number of tissues in the dataset"""
        tissue_tested_count: Int!
        """number of compounds in the dataset"""
        compound_tested_count: Int!
        """number of experiments held across the dataset"""
        experiment_count: Int!
        """cell line names tested in the dataset"""
        cells_tested: [CellLine!]
        """compound names tested in the dataset"""
        compounds_tested: [Compound!]
    }
`;

const datasetStatsType = `
    type DatasetStats {
        """name and id of the dataset"""
        dataset: Dataset!
        """number of tested cell lines in the dataset"""
        cell_line_count: Int!
        """number of tested experiments in the dataset"""
        experiment_count: Int!
        """number of tested compounds in the dataset"""
        compound_count: Int!
        """number of tested tissues in the dataset"""
        tissue_count: Int!
    }
`;

// TODO: only tissues_tested field is extra when compared to dataset detail schema definition
// TODO: is there a difference when we get data from experiments table and dataset + a particular type table??
const dataTypesInformationPerDatasetType = `
    type DataTypesInformationPerDataset {
        """name and id of the dataset"""
        dataset: Dataset!
        """tissue ids and names tested in the dataset"""
        tissues_tested: [Tissue!]
        """cell line ids and names tested in the dataset"""
        cells_tested: [CellLine!]
        """compound ids and names tested in the dataset"""
        compounds_tested: [Compound!]
    }
`;

// TODO: maybe we might not need this??
const datasetsCompoundStatType = `
    type DatasetCompoundStat {
        """name and id of the dataset"""
        dataset: Dataset!
        """compound ids and names tested in the dataset"""
        compound_count: Int!
    }
`;

module.exports = {
    datasetType,
    datasetDetailType,
    datasetStatsType,
    dataTypesInformationPerDatasetType,
    datasetsCompoundStatType,
};
