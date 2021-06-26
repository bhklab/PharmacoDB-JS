const countType = `
    type Count {
        dataset: Generic!
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
        dataset: Generic!
        count: Int!
        type: String!
        list: [Generic!]!
    }
`;


const enumAllowedType = `
    enum AllowedValues {
        COMPOUND
        cell
        TISSUE
    }
`;


module.exports = {
    countType,
    summaryType,
    genericType,
    enumAllowedType
};