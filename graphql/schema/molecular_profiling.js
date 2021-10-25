const molecularProfilingType = `
    type MolecularProfiling {
        cell_line: CellLine!
        """dataset id and name in the database"""
        dataset: Dataset!
        """molecular data type in the database"""
        mDataType: String!
        """number of profiles in the database"""
        num_prof: Int!
    }
`;


module.exports = {
    molecularProfilingType,
};
