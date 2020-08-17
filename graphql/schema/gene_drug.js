const geneDrugType = `
    type GeneDrug {
        id: Int!
        geneId: Int!
        compound: Compound!
        dataset: Dataset!
        tissue: Tissue!
        estimate: Float!
        se: Float!
        n: Int!
        tstat: Float!
        fstat: Float!
        pvalue: Float!
        df: Int
        fdr: Float
        FWER_genes: Float!
        FWER_drugs: Float!
        FWER_all: Float!
        BF_p_all: Int
        sens_stat: String
        mDataType: String!
        level: Int
        drug_like_molecule: Int
        in_clinical_trials: Boolean
    }
`;

module.exports = {
    geneDrugType
};