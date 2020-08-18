const geneDrugSearchByGeneQuery = `
  {
    gene_drug(geneId: 1, all: true) {
      id
      geneId
      estimate
      se
      n
      tstat
      fstat
      pvalue
      df
      fdr
      FWER_genes
      FWER_drugs
      FWER_all
      BF_p_all
      mDataType
      level
      drug_like_molecule
      in_clinical_trials
      dataset {
        id
        name
      }
      compound {
        id
        name,
        annotation {
          smiles,
          fda_status,
          pubchem,
          inchikey
        }
      }
      tissue {
        id
        name
      }
    }
  }
`;



module.exports = {
    geneDrugSearchByGeneQuery
};