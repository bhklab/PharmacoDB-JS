const datasetType = `
    type Dataset {
        id: Int!
        name: String!  
    }
`;

const datasetInformationType = `
    type DatasetInformation {
        id: Int!
        name: String!
        # number of cell-lines in the dataset.
        cells: Int!
        # number of tissues in the dataset.
        tissues: Int!
        # number of compounds in the dataset.
        compounds: Int!
        # number of experiments held across the dataset.
        experiments: Int!
        # cells tested in the dataset.
        cell_tested: [String!]
        # compounds tested in the dataset.
        compounds_tested: [String!]
    }
`;

module.exports = {
    datasetType,
    datasetInformationType
};
