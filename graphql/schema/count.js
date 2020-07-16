const CountType = `
    type Count {
        "This is the dataset object"
        dataset: Dataset!
        "Number of the elements in source/dataset"
        count: Int!
    }
`;


module.exports = {
    CountType
};