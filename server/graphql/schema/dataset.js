const datasetType = `
    type Dataset {
        id: Int!
        name: String!
        cells_tested: Int!
        tissues_tested: Int!
        compounds_tested: Int!
    }
`;

module.exports = {
    datasetType
};
