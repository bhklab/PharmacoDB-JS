const compoundAnnotationType = `
    type CompoundAnnotation {
        smiles: String
        inchikey: String
        pubchem: String
    }
`;

const compoundType = ` 
    type Compound {
        id: Int!
        name: String!
        annotation: CompoundAnnotation! # to-one
    }
`;

const singleCompoundType = `
    type SingleCompound {

    }
`;

module.exports = {
    compoundType,
    compoundAnnotationType,
    singleCompoundType
};
