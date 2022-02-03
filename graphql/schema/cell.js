// variable storing the basic cell type with id, uid and name
const cellType = `
        """cell line id in the database"""
        id: Int!
        """cell line uid in the database"""
        uid: String!
        """cell line name in the database"""
        name: String!
`;

// cell line type 
const cellLineType = `
    type CellLine {
        ${cellType}
    }
`;

// cell line type with tissue and dataset
const cellLineWithTissueDatasetType = `
    type CellLineWithTissueDataset {
        ${cellType}
        """cell line's tissue type"""
        tissue: Tissue!
        """dataset information of the cell line"""
        dataset: [Dataset!]
    }
`;

// cell line detail type
const cellLineDetailType = `
    type CellLineDetail {
        ${cellType}
        """cell line's tissue type"""
        tissue: Tissue!
        """synonyms (name) in different datasets"""
        synonyms: [SourceAnnotation]
        """list of datasets names and ids"""
        datasets: [Dataset]!
        """diseases from cellosaurus"""
        diseases: [String]
        """accession id from cellosaurus"""
        accessions: String
    }
`;


module.exports = {
    cellLineType,
    cellLineWithTissueDatasetType,
    cellLineDetailType
};
