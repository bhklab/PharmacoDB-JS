const cellLineType = `
    type CellLine {
        id: Int!
        name: String!
        tissue: Tissue!
    }
`;

const cellAnnotationType = `
    type CellLineAnnotation {
        id: Int!
        name: String!
        tissue: Tissue!
        annotations: [SourceAnnotation!]
    }
`;

module.exports = {
    cellLineType,
    cellAnnotationType
};
