const compoundType = `
    type Compound {
        """compound id in the database"""
        id: Int!
        """compound name in the database"""
        name: String!
        """compound uid"""
        uid: String!
        """compound annotation object"""
        annotation: CompoundAnnotation!
    }
`;

const compoundAnnotationType = `
    type CompoundAnnotation {
        """annotations for compound"""
        smiles: String
        inchikey: String
        pubchem: String
        """ this is either 0 or 1 in the database, 
            but API gives the output as Approved/Not-Approved """
        fda_status: String
        chembl: String
        reactome: String
    }
`;

const compoundWithDatasetType = ` 
    type CompoundWithDataset {
        """compound id in the database"""
        id: Int!
        """compound name in the database"""
        name: String!
        """compound uid"""
        uid: String!
        """compound annotation object"""
        annotation: CompoundAnnotation! # to-one
        """dataset information object"""
        dataset: Dataset!
    }
`;

const compoundDetailType = `
    type CompoundDetail {
        """compound object with id, name and annotation"""
        compound: CompoundWithDataset!
        """synonyms (names) in different sources (datasets)"""
        synonyms: [Synonym!]
        """compound targets"""
        targets: [TargetWithGeneInfo]
    }
`;

module.exports = {
    compoundType,
    compoundAnnotationType,
    compoundWithDatasetType,
    compoundDetailType,
};
