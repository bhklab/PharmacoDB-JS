const cellLineType = `
    type CellLine {
        id: Int!
        name: String!
        tissue: Tissue!
    }
`;

const cellAnnotationType = `
    type SourceAnnotation {
        """this is the name of a type ie tissue, cell that is used in the dataset"""
        name: String!
        """it's dataset name in our case"""
        source: [String!]
    }
`;

const cellLineDetailType = `
    type CellLineDetail {
        id: Int!
        name: String!
        tissue: Tissue!
        synonyms: [SourceAnnotation!]
        diseases: [String]
        accessions: [String!]
    }
`;

module.exports = {
    cellLineType,
    cellLineDetailType,
    cellAnnotationType
};
