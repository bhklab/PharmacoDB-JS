const targetType = `
    type Target {
        """tissue id in the database"""
        id: Int!
        """tissue name in the database"""
        name: String!
    }
`;

// const compoundTargetType = `
//     type CompoundTarget {
//         """compound id in the database"""
//         compound_id: Int!
//         """compound name in the database"""
//         compound_name: String!
//         """target object"""
//         targets: [Target]
//     }
// `;

const compoundTargetType = `
    type CompoundTarget {
        compound_id: Int!
        target_id: Int!
    }
`;

module.exports = {
    targetType,
    compoundTargetType,
};