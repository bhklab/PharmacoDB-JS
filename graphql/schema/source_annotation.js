const sourceAnnotationType = `
    type SourceAnnotation {
        name: String!
        """it's dataset in our case"""
        source: [String!]
    }
`;

module.exports = {
    sourceAnnotationType
};
