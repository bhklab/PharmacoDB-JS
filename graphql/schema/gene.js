const geneType = `
    type Gene {
        id: Int!
        name: String!
        annotation: GeneAnnotation!
    }
`;

const geneAnnotationType = `
    type GeneAnnotation {
        gene_id: Int!
        symbol: String
        gene_seq_start: Int
        gene_seq_end: Int
        chr: String
        strand: String
    }
`;

module.exports = {
    geneType,
    geneAnnotationType
};
