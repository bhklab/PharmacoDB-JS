const sourceType = `
    type Source {
        "id of the source"
        id: Int!
        "name of the source"
        name: String!
        "dataset object including name and id of the object"
        dataset: Dataset!
    }
`;

module.exports = {
    sourceType
};