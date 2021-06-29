const geneType = `
    type Gene {
        """gene id in the database"""
        id: Int!
        """gene name in the database"""
        name: String!
        """gene annotation object"""
        annotation: GeneAnnotation!
    }
`;

const geneAnnotationType = `
    type GeneAnnotation {
        """gene id in the database"""
        gene_id: Int!
        """gene annotations"""
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
