const summaryType = `
    type Summary {
        dataset: Generic!
        count: Int!
        type: String!
        list: [Generic!]!
    }
`;

module.exports = {
    summaryType,
};
