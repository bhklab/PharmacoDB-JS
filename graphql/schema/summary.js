// TODO: list type should be any type, not just limited to CellLine
const summaryType = `
    type Summary {
        dataset: Dataset!
        count: Int!
        type: String!
        list: [CellLine!]!
    }
`;

module.exports = {
    summaryType,
};
