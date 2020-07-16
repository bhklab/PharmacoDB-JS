const countType = `
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
        count: Int!
        list: [Generic!]
    }
`;


module.exports = {
    countType,
    summaryType,
    genericType
};