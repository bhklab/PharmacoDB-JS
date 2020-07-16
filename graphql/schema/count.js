const CountType = `
    type Count {
        "This is the dataset object"
        dataset: Dataset!
        "Number of the elements in source/dataset"
        count: Int!
    }
`;


const genericType = `
    type Generic {
        id: Int!
        name: String!
    }
`;


const summaryType = `
    type Summary {
        dataset: Dataset!
        type: String!
        list: [Generic!]
    }
`;


module.exports = {
    CountType,
    summaryType,
    genericType
};