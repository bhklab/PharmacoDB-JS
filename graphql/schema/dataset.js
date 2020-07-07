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
        cells: Int!
        tissues: Int!
        compounds: Int!
        experiments: Int!
        cells_tested: [String!]
        compounds_tested: [String!]
    }
`;

module.exports = {
    datasetType,
    datasetInformationType
};
