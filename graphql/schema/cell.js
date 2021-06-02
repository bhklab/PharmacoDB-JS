const cellLineType = `
    type CellLine {
        id: Int!
        name: String!
        tissue: Tissue!
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
    cellLineDetailType
};
