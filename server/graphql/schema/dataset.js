const datasetType = `
    type Dataset {
        id: Int!
        name: String!
        tested_cells: Int!
        tested_tissues: Int!
        tested_compounds: Int!
    }
`;

module.exports = {
    datasetType
};
