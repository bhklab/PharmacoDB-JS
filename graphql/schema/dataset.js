const datasetType = `
    type Dataset {
        "id of the dataset in the database"
        id: Int!
        "name of the dataset"
        name: String!
        "number of compounds tested in the dataset"
        compound_tested_count: Int
        "number of cell lines used in the dataset"
        cell_count: Int
        "number of experiments in the dataset"
        experiment_count: Int 
    }
`;


const datasetInformationType = `
    type DatasetInformation {
        "id of the dataset"
        id: Int!
        "name of the dataset"
        name: String!
        "number of cell-lines in the dataset"
        cell_count: Int!
        "number of tissues in the dataset"
        tissue_tested_count: Int!
        "number of compounds in the dataset"
        compound_tested_count: Int!
        "number of experiments held across the dataset"
        experiment_count: Int!
        "cell line names tested in the dataset"
        cells_tested: [String!]
        "compound names tested in the dataset"
        compounds_tested: [String!]
    }
`;


module.exports = {
    datasetType,
    datasetInformationType,
};