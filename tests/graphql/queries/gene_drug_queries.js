const geneDrugSearchByGeneQuery = `
  {
    gene_drugs(geneId: 1) {
      id
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
      gene {
        id
        name
        annotation {
          gene_id
          ensg
          gene_seq_start
          gene_seq_end
        }
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