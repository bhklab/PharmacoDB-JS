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
        # annotations: [SourceAnnotation!]
        synonyms: [SourceAnnotation!]
        # number of cell lines of the tissue type per dataset.
        cell_count: [DatasetCount!]
        # number of compounds tested with the particular tissue cell lines.
        compounds_tested: [DatasetCount!]
    }
`;


module.exports = {
    tissueType,
    tissueAnnotationType,
};
