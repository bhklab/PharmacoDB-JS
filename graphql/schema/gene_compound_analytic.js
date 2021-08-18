// variable to store the common columns of 
const geneCompoundAnalytics = `
    id: Int!
    gene: Gene!
    compound: Compound!
    dataset: Dataset!
    estimate: Float
    lower_analytic: Float
    upper_analytic: Float
    lower_permutation: Float
    upper_permutation: Float
    n: Int
    pvalue_analytic: Float
    pvalue_permutation: Float
    df: Int
    fdr_analytic: Float
    fdr_permutation: Float
    significant_permutation: Int
    permutation_done: Int
    sens_stat: String
    mDataType: String
`;


const geneCompoundTissueDatasetType = `
    type GeneCompoundTissueDataset {
        ${geneCompoundAnalytics}
        tissue: Tissue!
    }
`;

const geneCompoundDatasetType = `
    type GeneCompoundDataset {
        ${geneCompoundAnalytics}
    }
`;

module.exports = {
    geneCompoundTissueDatasetType,
    geneCompoundDatasetType,
};
