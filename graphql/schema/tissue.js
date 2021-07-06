const tissueType = `
    type Tissue {
        id: Int!
        name: String!
        dataset: Generic!
    }
`;

// we can also merge this to the tissue type itself and query based on it.
// but for the simplicity sake I am not doing that with this type.
// example: Compound Type.
const tissueDetailType = `
    type TissueDetail {
        id: Int!
        name: String!
        """this list the synonyms for the tissue in different datasets"""
        synonyms: [SourceAnnotation!]
        """number of cell lines of the tissue type per dataset"""
        cell_count: [Count!]
        """number of compounds tested with the particular tissue cell lines"""
        compounds_tested: [Count!]
    }
`;


module.exports = {
    tissueType,
    tissueDetailType,
};
