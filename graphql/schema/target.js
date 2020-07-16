const targetType = `
    type Target {
        id: Int!
        name: String!
    }
`;

const compoundTargetType = `
    type CompoundTarget {
        compound_id: Int!
        compound_name: String!
        targets: [Target!]
    }
`;

module.exports = {
    targetType,
    compoundTargetType
};