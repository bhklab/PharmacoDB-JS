const compoundAnnotationType = `
    type CompoundAnnotation {
        smiles: String
        inchikey: String
        pubchem: String
        """ this is either 0 or 1 in the database, 
            but API gives the output as Approved/Not-Approved """
        fda_status: String
    }
`;

const compoundType = ` 
    type Compound {
        id: Int!
        name: String!
        uid: String!
        annotation: CompoundAnnotation! # to-one
    }
`;

const compoundDetailType = `
    type CompoundDetail {
        compound: Compound!
        synonyms: [SourceAnnotation!]
        targets: [Target!]
    }
`;

module.exports = {
    compoundType,
    compoundAnnotationType,
    compoundDetailType
};