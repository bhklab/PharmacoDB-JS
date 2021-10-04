const compoundTableType = `
    type CompoundTable {
        """compound id in the database"""
        id: Int!
        """compound name in the database"""
        name: String!
        """compound uid"""
        uid: String!
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

const compoundType = ` 
    type Compound {
        """compound id in the database"""
        id: Int!
        """compound name in the database"""
        name: String!
        """compound uid"""
        uid: String!
        """compound annotation object"""
        annotation: CompoundAnnotation! # to-one
        """dataset information object"""
        dataset: [Generic!]
    }
`;

const compoundDetailType = `
    type CompoundDetail {
        """compound object with id, name and annotation"""
        compound: Compound!
        """synonyms (names) in different sources (datasets)"""
        synonyms: [SourceAnnotation!]
        """compound targets"""
        targets: [TargetWithGeneInfo]
        """dataset information object"""
        datasets: [Generic]!
    }
`;

module.exports = {
    compoundType,
    compoundAnnotationType,
    compoundDetailType,
    compoundTableType,
};
