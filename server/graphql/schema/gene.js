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
        ensg: String
        gene_seq_start: Int
        gene_seq_end: Int
    }
`;

module.exports = {
    geneType,
    geneAnnotationType
};
