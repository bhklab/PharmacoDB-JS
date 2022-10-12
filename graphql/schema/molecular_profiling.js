const molecularProfilingType = `
    type MolecularProfiling {
        cell_line: CellLine!
        """dataset id and name in the database"""
        dataset: Dataset!
        """molecular data type"""
        mDataType: String!
        """number of profiles"""
        num_prof: Int!
    }
`;


module.exports = {
    molecularProfilingType,
};
