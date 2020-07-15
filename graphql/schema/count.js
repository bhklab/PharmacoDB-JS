const datasetCountType = `
    type DatasetCount {
        "This is the dataset object"
        dataset: Dataset!
        "Number of the elements in source/dataset"
        count: Int!
    }
`;

module.exports = {
    datasetCountType
};