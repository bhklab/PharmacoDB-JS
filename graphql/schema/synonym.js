const synonymType = `
    type Synonym {
        """
            this is the name of a type which can be a name of 
            tissue, cell line that has different name (synonym) in different datasets
        """
        name: String!
        """it's dataset name in our case"""
        dataset: [Dataset!]
    }
`;

module.exports = {
    synonymType,
};
