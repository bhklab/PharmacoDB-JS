const tissueType = `
    type Tissue {
        id: Int!
        name: String!
    }
`;

const countType = `
    type Count {
        dataset: Dataset!
        count: Int!
    }
`;

// we can also merge this to the tissue type itself and query based on it.
// but for the simplicity sake I am not doing that with this type.
// example: Compound Type.
const tissueAnnotationType = `
    type TissueAnnotation {
        id: Int!
        name: String!
        annotations: [SourceAnnotation!]
        # number of cell lines of the tissue type per dataset.
        cell_count: [Count!]
        # number of compounds tested with the particular tissue cell lines.
        compounds_tested: [Count!]
    }
`;

module.exports = {
    tissueType,
    tissueAnnotationType,
    countType
};
