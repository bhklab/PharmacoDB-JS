const datasets = {
  1: {
    id: 1,
    name: 'CCLE',
    acr: 'Broad-Novartis Cancer Cell Line Encyclopedia (CCLE)',
    acr_ref: '',
    des: 'The Cancer Cell Line Encyclopedia (CCLE) project is a collaboration between the Broad Institute, the Novartis Institutes for Biomedical Research, and its Genomics Institute of the Novartis Research Foundation to conduct a detailed genetic and pharmacologic characterization of a large panel of human cancer models, to develop integrated computational analyses that link distinct pharmacologic vulnerabilities to genomic patterns and to translate cell line integrative genomics into cancer patient stratification. The CCLE provides public access to genomic data as well as analysis and visualization for about 1000 cell lines.',
    resource: [
      { id: '0', name: 'CCLE website', urlextern: 'http://www.broadinstitute.org/ccle/home' },
      { id: '1', name: 'RNA-seq on NCI Genomic Data Commons', urlextern: 'https://portal.gdc.cancer.gov/legacy-archive/search/f' },
    ],
    pub: [
      {
        id: '0',
        title: 'The Cancer Cell Line Encyclopedia enables predictive modelling of anticancer drug sensitivity, Nature 2012',
        url: 'http://www.nature.com/nature/journal/v483/n7391/full/nature11003.html',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
      {
        type: 'mRNA Expression', platform: 'Affymetrix HG-U133PLUS2', raw: 'Yes', processed: ['BrainArray', 'RMA'],
      },
      {
        type: 'mRNA Expression', platform: 'Illumina RNA-seq', raw: 'Yes', processed: ['No'],
      },
      {
        type: 'DNA Copy Number',
        platform: 'Affymetrix SNP 6.0',
        raw: 'Yes',
        processed: ['Birdseed', 'Normalized log2 ratios'],
      },
      {
        type: 'DNA Mutation', platform: 'OncoMap', raw: 'No', processed: ['MAF'],
      },
      {
        type: 'DNA Mutation', platform: 'Hybrid Capture', raw: 'Yes', processed: ['MAF'],
      },
    ],
  },
  2: {
    id: 2,
    name: 'CTRPv2',
    acr: 'Cancer Therapeutics Response Portal version 2 (CTRPv2)',
    acr_ref: '',
    des: 'The Cancer Therapeutics Response Portal was developed by the Center for the Science of Therapeutics at the Broad Institute to screen a large panel of cancer cell lines for sensitivity to small molecules. CTRPv2 is a continuation of the CTRP project and the largest pharmacological screen conducted to date, containing several hundreds of thousands of drug dose-response curves.',
    resource: [
      { id: '0', name: 'Homepage', urlextern: 'http://www.broadinstitute.org/ctrp/' },
      { id: '1', name: 'NCI Open Access Data Portal', urlextern: 'https://ctd2.nci.nih.gov/dataPortal/' },
    ],
    pub: [
      {
        id: '0',
        title: '"Correlating chemical sensitivity and basal gene expression reveals mechanism of action", Rees et al., Nat Chem Biol, 12, 109-116 (2016);',
        url: 'http://www.ncbi.nlm.nih.gov/pubmed/26656090',
      },
      {
        id: '1',
        title: '"Harnessing Connectivity in a Large-Scale Small-Molecule Sensitivity Dataset", Seashore-Ludlow et al., Cancer Discovery, 5, 1210-1223 (2015);',
        url: 'http://www.ncbi.nlm.nih.gov/pubmed/26482930',
      },
      {
        id: '2',
        title: '"An Interactive Resource to Identify Cancer Genetic and Lineage Dependencies Targeted by Small Molecules", Basu, Bodycombe, Cheah, et al., Cell, 154, 1151-1161 (2013).',
        url: 'http://www.ncbi.nlm.nih.gov/pubmed/23993102',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
    ],
  },
  3: {
    id: 3,
    name: 'FIMM',
    acr: 'Institute for Molecular Medicine Finland (FIMM)',
    acr_ref: '',
    des: 'The Institute for Molecular Medicine Finland (FIMM) cell line sensitivity dataset consists of cancer cell lines screened with a small set of anti-cancer therapies profiled using a platform developed for an Individualized Systems Medicine approach for screening patient tumour. The study sought to establish the effects of concentration range, cell viability assay and sensitivity measures on consistency in drug response profiling and argue for the standardization of protocols across laboratories to improve the utility of in vitro screening for personalized medicine approaches.',
    resource: [],
    pub: [
      {
        id: '0',
        title: 'Mpindi, J. P. et al. Consistency in drug response profiling. Nature 540, E5–E6 (2016).',
        url: 'https://www.nature.com/nature/journal/v540/n7631/full/nature20171.html',
      },
      {
        id: '1',
        title: 'Pemovska, T. et al. Individualized Systems Medicine Strategy to Tailor Treatments for Patients with Chemorefractory Acute Myeloid Leukemia. Cancer Discov 3, 1416–1429 (2013).',
        url: 'https://cancerdiscovery.aacrjournals.org/content/3/12/1416',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['DSS'],
      },
    ],
  },
  4: {
    id: 4,
    name: 'gCSI',
    acr: 'The Genentech Cell Line Screening Initiative (gCSI)',
    acr_ref: '',
    des: 'The Genentech Cell Line Screening Initiative (gCSI) was undertaken independently of CCLE and GDSC to to address the concerns of inconsistencies across large-scale pharmacogenomic studies. In gCSI, Genentech independently characterized the response of 410 cancer cell lines to a subset \u200Bagents tested by GDSC and CCLE. Genentech also evaluated three specific aspects of the screening protocols that are relevant to measured drug response: readout of cell viability (metabolic versus DNA content), seeding density strategy, and cell culture media conditions.',
    resource: [
      { id: '0', name: 'compareDrugScreens package', urlextern: 'http://research-pub.gene.com/gCSI-cellline-data' },
      { id: '1', name: 'RNA-seq data', urlextern: 'http://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-2706/' },
      { id: '2', name: 'RNA-seq and SNapp array data', urlextern: 'https://www.ebi.ac.uk/ega/studies/EGAS00001000610' },
    ],
    pub: [
      {
        id: '0',
        title: 'A comprehensive transcriptional portrait of human cancer cell lines, Nature Biotechnology 2015',
        url: 'http://www.nature.com/nbt/journal/v33/n3/abs/nbt.3080.html',
      },
      {
        id: '1',
        title: 'Reproducible pharmacogenomic profiling of cancer cell line panels, Nature 2016',
        url: 'http://www.nature.com/nature/journal/v533/n7603/full/nature17987.html',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
      {
        type: 'mRNA Expression', platform: 'Illumina RNA-seq', raw: 'Yes', processed: ['VSN/DESeq counts', 'RPKM'],
      },
      {
        type: 'DNA Copy Number', platform: 'Illumina 2.5M SNP', raw: 'Yes', processed: ['PICNIC'],
      },
      {
        type: 'DNA Mutation', platform: 'Sanger', raw: 'No', processed: ['CSV'],
      },
    ],
  },
  5: {
    id: 5,
    name: 'GDSC1000',
    acr: 'Genomics of Drug Sensitivity in Cancer (GDSC)',
    acr_ref: '',
    des: 'The Genomics of Drug Sensitivity in Cancer \u200B(GDSC) \u200BProject is part of a Wellcome Trust funded collaboration between The Cancer Genome Project at the Wellcome Trust Sanger Institute (UK) and the Center for Molecular Therapeutics,\u200B Massachusetts General Hospital Cancer Center (USA). As part of this collaboration,\u200B the GDSC group is screening >1000 genetically characterised human cancer cell lines with a wide range of anti-cancer therapeutics. These compounds include cytotoxic chemotherapeutics as well as targeted therapeutics from commercial sources, academic collaborators,\u200B and from the biotech and pharmaceutical industries. The sensitivity patterns of the cell lines are correlated with extensive \u200B(epi)genomic and expression data to identify genetic features that are predictive of sensitivity. This large collection of cell lines aims at capturing much of the genomic heterogeneity that underlies human cancer, and which appears to play a critical role in determining the variable response of patients to treatment with specific agents.\nAs part of this collaboration, the GDSC group is screening &gt;1000 genetically characterised human cancer cell lines with a wide range of anti-cancer therapeutics. These compounds include cytotoxic chemotherapeutics as well as targeted therapeutics from commercial sources, academic collaborators, and from the biotech and pharmaceutical industries. The sensitivity patterns of the cell lines are correlated with extensive genomic and expression data to identify genetic features that are predictive of sensitivity. This large collection of cell lines aims at capturing much of the genomic heterogeneity that underlies human cancer, and which appears to play a critical role in determining the variable response of patients to treatment with specific agents.',
    resource: [
      { id: '0', name: 'GDSC website', urlextern: 'http://www.cancerrxgene.org/' },
      {
        id: '1',
        name: 'Microarray gene expression data',
        urlextern: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-783/',
      },
    ],
    pub: [
      {
        id: '0',
        title: 'Systematic identification of genomic markers of drug sensitivity in cancer cells, Nature 2012',
        url: 'http://www.nature.com/nature/journal/v483/n7391/full/nature11005.html',
      },
      {
        id: '1',
        title: 'Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells, Nucleic Acids Research 2013',
        url: 'http://nar.oxfordjournals.org/content/41/D1/D955',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'Syto60', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
      {
        type: 'mRNA Expression', platform: 'Affymetrix HG-U133A', raw: 'Yes', processed: ['RMA'],
      },
      {
        type: 'DNA Copy Number', platform: 'Affymetrix SNP 6.0', raw: 'Yes', processed: ['PICNIC'],
      },
      {
        type: 'DNA Mutation', platform: 'Sanger', raw: 'No', processed: ['CSV'],
      },
      {
        type: 'DNA Methylation', platform: 'Illumina array 450K', raw: 'Yes', processed: ['GenomeStudio'],
      },
    ],
  },
  6: {
    id: 6,
    name: 'GRAY',
    acr: "Dataset generated in Dr. Joe Gray's lab at the Oregon Health and Science University",
    acr_ref: 'http://www.ohsu.edu/xd/education/schools/school-of-medicine/departments/basic-science-departments/biomedical-engineering/people/joe-gray.cfm',
    des: 'As part of the Stand Up to Cancer Breast Cancer Dream Team, the Gray laboratory profiled over 70 breast cancer cell lines and screened them with 90 experimental or approved drugs.',
    resource: [
      { id: '0', name: 'Affymetrix SNP 6.0 part 1', urlextern: 'https://www.ebi.ac.uk/ega/studies/EGAS00000000059' },
      { id: '1', name: 'Affymetrix SNP 6.0 part 2', urlextern: 'https://www.ebi.ac.uk/ega/studies/EGAS00001000585' },
      { id: '2', name: 'Affymetrix Exon 1.0 ST array', urlextern: 'http://www.ebi.ac.uk/arrayexpress/experiments/E-TABM-181/' },
      { id: '3', name: 'Affymetrix HG-U133A array', urlextern: 'http://www.ebi.ac.uk/arrayexpress/experiments/E-TABM-157/' },
      { id: '4', name: 'llumina RNA-seq data', urlextern: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48216' },
      {
        id: '5',
        name: 'Illumina Methylation27 BeadChip',
        urlextern: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE42944',
      },
      {
        id: '6',
        name: 'Reverse Protein Lysate Array',
        urlextern: 'https://static-content.springer.com/esm/art%3A10.1186%2Fgb-2013-14-10-r110/MediaObjects/13059_2013_3164_MOESM2_ESM.xlsx',
      },
      { id: '7', name: 'Whole Exome-Seq', urlextern: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE48216' },
    ],
    pub: [
      {
        id: '0',
        title: 'Subtype and pathway specific responses to anticancer compounds in breast cancer. Proceedings of the National Academy of Sciences 2011',
        url: 'http://www.pnas.org/content/109/8/2724.abstract',
      },
      {
        id: '1',
        title: 'Modeling precision treatment of breast cancer, Genome Biology 2013',
        url: 'http://genomebiology.biomedcentral.com/articles/10.1186/gb-2013-14-10-r110',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['IC50'],
      },
      {
        type: 'mRNA Expression', platform: 'Affymetrix HG-U133A', raw: 'Yes', processed: ['RMA'],
      },
      {
        type: 'mRNA Expression', platform: 'Affymetrix GC Exon 1.0 ST', raw: 'Yes', processed: ['log-additive PLM'],
      },
      {
        type: 'mRNA Expression', platform: 'Agilent Automation RNAseq', raw: 'Yes', processed: ['FPKM'],
      },
      {
        type: 'DNA Copy Number', platform: 'Affymetrix SNP 6.0', raw: 'Yes', processed: ['GISTIC'],
      },
      {
        type: 'Methylation', platform: 'Illumina Infinium Human Methylation27', raw: 'Yes', processed: ['Beta Values'],
      },
      {
        type: 'Protein Expression', platform: 'RPPA', raw: 'No', processed: ['MicroVigene expression intensity'],
      },
      {
        type: 'Exomeseq', platform: 'Agilent Automation', raw: 'Yes', processed: [],
      },
    ],
  },
  7: {
    id: 7,
    name: 'UHNBreast',
    acr: 'University Health Network (UHN) Breast Cancer (BC) Screen',
    acr_ref: '',
    des: 'Molecular profiling and pharmacological screening of a selection of 84 breast cancer cell lines undertaken at the Princess Margaret Cancer Centre to identify cancer treatment targets and drug biomarkers.',
    resource: [
      { id: '0', name: 'Data Website', urlextern: 'http://neellab.github.io/bfg/' },
      { id: '1', name: 'RNA-seq data', urlextern: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE73526' },
      { id: '2', name: 'Functional genetic screen data', urlextern: 'http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE74702' },
    ],
    pub: [
      {
        id: '0',
        title: 'Functional Genomic Landscape of Human Breast Cancer Drivers, Vulnerabilities, and Resistance; Cell 2016',
        url: 'http://www.cell.com/cell/abstract/S0092-8674(15)01624-4',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'Sulforhodamine B colorimetric', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
      {
        type: 'mRNA expression', platform: 'Illumina HiSeq 2000 RNAseq', raw: 'Yes', processed: ['FPKM'],
      },
      {
        type: 'DNA Copy Number', platform: 'Illumina Human Omni-Quad', raw: 'No', processed: ['logR'],
      },
      {
        type: 'Protein Expression', platform: 'RPPA', raw: 'No', processed: ['MicroVigene expression intensity'],
      },
    ],
  },
  8: {
    id: 8,
    name: 'gCSI',
    acr: 'The Genentech Cell Line Screening Initiative (gCSI)',
    acr_ref: '',
    des: 'The Genentech Cell Line Screening Initiative (gCSI) was undertaken independently of CCLE and GDSC to to address the concerns of inconsistencies across large-scale pharmacogenomic studies. In gCSI, Genentech independently characterized the response of 410 cancer cell lines to a subset ​agents tested by GDSC and CCLE. Genentech also evaluated three specific aspects of the screening protocols that are relevant to measured drug response: readout of cell viability (metabolic versus DNA content), seeding density strategy, and cell culture media conditions.',
    resource: [
      { id: '0', name: 'compareDrugScreens package', urlextern: 'http://research-pub.gene.com/gCSI-cellline-data' },
      { id: '1', name: 'RNA-seq data', urlextern: 'https://www.ebi.ac.uk/arrayexpress/experiments/E-MTAB-2706/' },
      { id: '2', name: 'RNA-seq and SNP array data', urlextern: 'https://ega-archive.org/studies/EGAS00001000610' },
    ],
    pub: [
      {
        id: '0',
        title: 'A comprehensive transcriptional portrait of human cancer cell lines, Nature Biotechnology 2015',
        url: 'https://www.nature.com/articles/nbt.3080',
      },
      {
        id: '1',
        title: 'Reproducible pharmacogenomic profiling of cancer cell line panels, Nature 2016',
        url: 'https://www.nature.com/articles/nature17987',
      },
    ],
    dtype: [
      {
        type: 'Pharmacological', platform: 'CellTiter Glo', raw: 'Yes', processed: ['AUC', 'IC50'],
      },
      {
        type: 'mRNA expression', platform: 'Illumina RNA-seq', raw: 'Yes', processed: ['VSN/DESeq counts', 'RPKM'],
      },
      {
        type: 'DNA Copy Number', platform: 'Illumina 2.5M SNP', raw: 'Yes', processed: ['PICNIC'],
      },
      {
        type: 'DNA Mutation', platform: 'Sanger', raw: 'No', processed: ['CSV'],
      },
    ],
  },
};
export default datasets;
