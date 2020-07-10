const datasetType = `
    type Dataset {
        "id of the dataset in the database"
        id: Int!
        "name of the dataset"
        name: String!  
    }
`;

const datasetInformationType = `
    type DatasetInformation {
        "id of the dataset"
        id: Int!
        "name of the dataset"
        name: String!
        "number of cell-lines in the dataset"
        cells: Int!
        "number of tissues in the dataset"
        tissues: Int!
        "number of compounds in the dataset"
        compounds: Int!
        "number of experiments held across the dataset"
        experiments: Int!
        "cell lines tested in the dataset"
        cells_tested: [String!]
        "compounds tested in the dataset"
        compounds_tested: [String!]
    }
`;

module.exports = {
    datasetType,
    datasetInformationType
};