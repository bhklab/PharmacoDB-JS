const targetType = `
    type Target {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
    }
`;

const geneTargetType = `
    type GeneTarget {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
        """gene object associated with the target"""
        gene: Gene
    }
`;

const compoundTargetType = `
    type CompoundTarget {
        """compound id in the database"""
        compound_id: Int!
        """compound name in the database"""
        compound_name: String!
        """target object"""
        targets: [Target]
    }
`;

const geneCompoundTargetType = `
    type GeneCompoundTarget {
        """compound id in the database"""
        compound_id: Int!
        """compound name in the database"""
        compound_name: String!
        """target object"""
        targets: [GeneTarget]
    }
`;

module.exports = {
    targetType,
    geneTargetType,
    compoundTargetType,
    geneCompoundTargetType
};