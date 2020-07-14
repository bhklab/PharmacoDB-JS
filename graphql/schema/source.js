const sourceType = `
    type Source {
        "id of the source"
        id: Int!
        "name of the source"
        name: String!
        "dataset object including name and id of the object"
        dataset: Dataset!
    }
`;

const sourceStatsType = `
    type SourceStats {
        source_id: Int!
        source_name: String!
        cell_line_count: Int!
        tissue_count: Int!
        compound_count: Int!
        experiment_count: Int!
    }
`;

module.exports = {
    sourceType,
    sourceStatsType
};