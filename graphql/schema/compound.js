const compoundType = ` 
    type Compound {
        id: Int!
        name: String!
        annotation: CompoundAnnotation! # to-one
    }
`;

const compoundAnnotationType = `
    type CompoundAnnotation {
        drug_id: Int!
        smiles: String
        inchikey: String
        pubchem: String
    }
`;

module.exports = {
    compoundType,
    compoundAnnotationType
};
