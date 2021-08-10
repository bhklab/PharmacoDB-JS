const sourceAnnotationType = `
    type SourceAnnotation {
        """this is the name of a type ie tissue, cell that is used in the dataset"""
        name: String!
        """it's dataset name in our case"""
        source: [Generic!]
    }
`;

module.exports = {
    sourceAnnotationType,
};
