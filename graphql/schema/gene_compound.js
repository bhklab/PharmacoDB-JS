// variable storing the gene compound fields.
const geneCompound = `
        id: Int!
        gene: Gene!
        compound: Compound!
        estimate: Float
        lower: Float
        upper: Float
        n: Int
        tstat: Float
        fstat: Float
        pvalue: Float
        df: Int
        fdr: Float
        FWER_gene: Float
        FWER_compound: Float
        FWER_all: Float
        BF_p_all: Float
        sens_stat: String
        mDataType: String
        tested_in_human_trials: Boolean
        in_clinical_trials: Boolean
`;

// gene compound tissue type using gene compound variable and additional tissue field.
const geneCompoundTissueType = `
    type GeneCompoundTissue {
       ${geneCompound}
       tissue: Tissue!
    }
`;

// gene compound dataset type using gene compound variable and additional dataset field.
const geneCompoundDatasetType = `
    type GeneCompoundDataset {
       ${geneCompound}
       dataset: Dataset!
    }
`;

// gene compound type using gene compound variable.
const geneCompoundType = `
    type GeneCompound {
        ${geneCompound}
    }
`;


module.exports = {
    geneCompoundTissueType,
    geneCompoundDatasetType,
    geneCompoundType
};
