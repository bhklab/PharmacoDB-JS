const tissueType = `
    type Tissue {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
    }
`;

const tissueTypeWithDatasetType = `
    type TissueWithDataset {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
        """dataset information object"""
        dataset: [Dataset!]
    }
`;

const tissueDetailType = `
    type TissueDetail {
        id: Int!
        name: String!
        """this list the synonyms for the tissue in different datasets"""
        synonyms: [Synonym!]
        """number of cell lines of the tissue type per dataset"""
        cell_count: [CountPerDataset!]
        """number of compounds tested with the particular tissue cell lines"""
        compounds_tested: [CountPerDataset!]
    }
`;


module.exports = {
    tissueType,
    tissueTypeWithDatasetType,
    tissueDetailType,
};
