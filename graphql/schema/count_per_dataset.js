const countPerDatasetType = `
    type CountPerDataset {
        dataset: Dataset!
        "Number of the elements in source/dataset"
        count: Int!
    }
`;

const enumAllowedType = `
    enum AllowedValues {
        COMPOUND
        CELL
        TISSUE
    }
`;


module.exports = {
    countPerDatasetType,
    enumAllowedType
};