const tissueType = `
    type Tissue {
        id: Int!
        name: String!
    }
`;

// we can also merge this to the tissue type itself and query based on it.
// but for the simplicity sake I am not doing that with this type.
// example: Compound Type.
const tissueAnnotationType = `
    type TissueAnnotation {
        id: Int!
        name: String!
        annotations: [Annotation!]

    }
`;

module.exports = {
    tissueType,
    tissueAnnotationType
};
