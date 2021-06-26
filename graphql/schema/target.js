const targetType = `
    type Target {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
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

module.exports = {
    targetType,
    compoundTargetType
};