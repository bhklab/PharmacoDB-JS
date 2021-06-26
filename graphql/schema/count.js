const countType = `
    type Count {
        dataset: Generic!
        "Number of the elements in source/dataset"
        count: Int!
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
    enumAllowedType
};