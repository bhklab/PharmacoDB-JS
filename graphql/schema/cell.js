const cellLineType = `
    type CellLine {
        """cell line id in the database"""
        id: Int!
        """cell line name in the database"""
        name: String!
        """cell line's tissue type"""
        tissue: Tissue!
        """dataset information of the cell line"""
        dataset: [Generic!]
    }
`;

const cellLineDetailType = `
    type CellLineDetail {
        """cell line id in the database"""
        id: Int!
        """cell line name in the database"""
        name: String!
        """cell line's tissue type"""
        tissue: Tissue!
        """synonyms (name) in different datasets"""
        synonyms: [SourceAnnotation!]
        """list of datasets names and ids"""
        datasets: [Generic]!
        """diseases from cellosaurus"""
        diseases: [String]
        """accession id from cellosaurus"""
        accessions: String
    }
`;

module.exports = {
    cellLineType,
    cellLineDetailType
};
