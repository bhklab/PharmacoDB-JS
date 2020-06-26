const cellLineType = `
    type CellLine {
        id: Int!
        name: String!
        tissue: Tissue!
    }
`;

const annotationType = `
    type Annotation {
        name: String!
        datasets: [String!]
    }
`;

const cellAnnotationType = `
    type CellLineAnnotation {
        id: Int!
        name: String!
        tissue: Tissue!
        annotations: [Annotation!]
    }
`;

module.exports = {
    cellLineType,
    annotationType,
    cellAnnotationType
};
