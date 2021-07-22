const geneCompoundTissueQuery = `
  {
    gene_compound_tissue(geneId: 94) {
      id
      estimate
      lower
      upper
      n
      tstat
      fstat
      pvalue
      df
      fdr
      FWER_gene
      FWER_compound
      FWER_all
      BF_p_all
      sens_stat
      mDataType
      tested_in_human_trials
      in_clinical_trials
      gene {
        id
        name
        annotation {
          gene_id
          gene_seq_start
          gene_seq_end
        }
      }
      compound {
        id
        name
        annotation {
          smiles
          fda_status
          pubchem
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
    geneCompoundTissueQuery,
};
