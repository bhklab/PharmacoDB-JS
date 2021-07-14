const molType = `
    type Mol {
        """dataset id in the database"""
        dataset_id: Int!
        """dataset name in the database"""
        dataset_name: String!
        """molecular data type in the database"""
        mDataType: String!
        """number of profiles in the database"""
        num_prof: Int!
    }
`;

module.exports = {
    molType,
};
