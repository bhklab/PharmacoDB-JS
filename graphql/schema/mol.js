const molType = `
    type Mol {
        """dataset id and name in the database"""
        dataset: Generic!
        """all molecular data types for the cell line in the database"""
        dataTypes: [String]!
        """molecular data type in the database"""
        mDataType: String!
        """number of profiles in the database"""
        num_prof: Int!
    }
`;


module.exports = {
    molType,
};
