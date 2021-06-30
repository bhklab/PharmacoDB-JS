const experimentType = `
    type Experiment {
        """id of the experiment in the database"""
        id: Int!
        """cell line information for the experiment"""
        cell_line: CellLine!
        """tissue information for the experiment"""
        tissue: Tissue!
        """compound information for the experiment"""
        compound: Compound!
        """dataset information for the experiment"""
        dataset: Dataset!
        """dose response object"""
        dose_response: [CompoundResponse!]
        """profile data like DSS1, DSS2, DSS3"""
        profile: Profile!
    }
`;

module.exports = {
    experimentType
};