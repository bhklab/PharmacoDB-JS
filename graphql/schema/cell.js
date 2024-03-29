// variable storing the basic cell type with id, uid and name
const cellLine = `
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
        ${cellLine}
    }
`;

// cell line type with tissue and dataset
const cellLineWithTissueDatasetType = `
    type CellLineWithTissueDataset {
        ${cellLine}
        """cell line's tissue type"""
        tissue: Tissue!
        """dataset information of the cell line; can belong to multiple datasets"""
        datasets: [Dataset!]
    }
`;

// cell line detail type  
const cellLineDetailType = `
    type CellLineDetail {
        ${cellLine}
        """cell line's tissue type"""
        tissue: Tissue!
        """synonyms (name) in different datasets"""
        synonyms: [Synonym]
        """list of datasets with their name and id"""
        datasets: [Dataset]!
        """diseases from cellosaurus"""
        diseases: [String]
        """accession id from cellosaurus"""
        accession_id: String
    }
`;

const cellLinePerDatasetType = `
    type CellLinePerDataset {
        dataset: Dataset!
        count: Int!
        type: String!
        list: [CellLine!]!
    }
`;


module.exports = {
    cellLineType,
    cellLineWithTissueDatasetType,
    cellLineDetailType,
    cellLinePerDatasetType
};
