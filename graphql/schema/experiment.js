const experimentType = `
    type Experiment {
        id: Int!
        cell_line: CellLine!
        tissue: Tissue!
        compound: Compound!
        dataset: Dataset!
        dose_responses: [DrugResponse!]
        profile: Profile!
    }
`;

module.exports = {
    experimentType
};