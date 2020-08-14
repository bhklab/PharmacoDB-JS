const geneDrugQuery = `
  {
    gene_drug(geneId: 1, all: true) {
      id
      geneId
      drugId
      estimate
      se
      n
      tstat
      fstat
      pvalue
    }
  }
`;

module.exports = {
    geneDrugQuery
};