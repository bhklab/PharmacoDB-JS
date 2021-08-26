const datasetType = `
    type Dataset {
        """id of the dataset in the database"""
        id: Int!
        """name of the dataset"""
        name: String!
        """number of compounds tested in the dataset"""
        compound_tested_count: Int
        """number of cell lines used in the dataset"""
        cell_count: Int
        """number of experiments in the dataset"""
        experiment_count: Int 
        """number of tissues in the dataset"""
        tissue_tested_count: Int 
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

const countDatasetType = `
    type CountDataset {
        """name and id of the dataset"""
        dataset: Generic!
        """number of tested types in the dataset"""
        count: Int!
    }
`;

const datasetStatsType = `
    type DatasetStats {
        """name and id of the dataset"""
        dataset: Generic!
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

module.exports = {
    datasetType,
    datasetDetailType,
    countDatasetType,
    datasetStatsType,
};
