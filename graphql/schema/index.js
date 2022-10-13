// NOTE: Please use the alphabetical order.
const { buildSchema } = require('graphql');
const { cellLineType, cellLineWithTissueDatasetType, cellLineDetailType, cellLinePerDatasetType } = require('./cell');
const { compoundType, compoundAnnotationType, compoundDetailType, compoundWithDatasetType } = require('./compound');
const { countPerDatasetType, enumAllowedType } = require('./count_per_dataset');
const { datasetType, datasetDetailType, datasetStatsType, datasetsTypesType, datasetsCompoundStatType } = require('./dataset');
const { doseResponseType } = require('./dose_response');
const { experimentType } = require('./experiment');
const { geneType, geneAnnotationType } = require('./gene');
const { geneCompoundTissueType, geneCompoundType } = require('./gene_compound');
const { geneCompoundDatasetType, geneCompoundTissueDatasetType } = require('./gene_compound_analytic');
const { RootQuery } = require('./root_query');
const { synonymType } = require('./synonym');
const { datatypeCountType } = require('./datatype_count');
const {
    targetType, compoundTargetType, geneTargetType,
    targetWithGeneInfoType, targetWithCompoundInfoType,
    geneTargetCompoundCountsType
} = require('./target');
const { tissueType, tissueTypeWithDatasetType, tissueDetailType } = require('./tissue');
const { profileType } = require('./profile');
const { molecularProfilingType } = require('./molecular_profiling');


// schema definition.
const schema = `
    "Compound Type with id, name and annotations"
    ${compoundType}
    ${compoundWithDatasetType}
    "Compound Annotation Type with compound id, smiles, inchikey and pubchem"
    ${compoundAnnotationType}
    ${compoundDetailType}

    "Cell Line Type with id and name of the cell lines"
    ${cellLineType}
    ${cellLineWithTissueDatasetType}
    ${cellLineDetailType}
    ${cellLinePerDatasetType}

    "Count Type"
    ${countPerDatasetType}

    "Dataset Type with id and name of the datasets"
    ${datasetType}
    ${datasetDetailType}
    ${datasetStatsType}
    ${datasetsTypesType}
    ${datasetsCompoundStatType}

    "compound Response Type with dose and response values"
    ${doseResponseType}

    ${enumAllowedType}

    "Experiment Type with experiment_id, cell line, tissue, compound and dataset types"
    ${experimentType}

    "Gene Type with id and name of the genes"
    ${geneType}
    "Gene Annotation Type with gene id, ensg, start and end"
    ${geneAnnotationType}

    """Synonym type with name of the synonym and the dataset it belongs to"""
    ${synonymType}

    "data type count Type"
    ${datatypeCountType}

    "Target Type"
    ${targetType}
    ${compoundTargetType}
    ${geneTargetType}
    ${targetWithGeneInfoType}
    ${targetWithCompoundInfoType}
    ${geneTargetCompoundCountsType}

    "Tissue Type with id and name of the tissues"
    ${tissueType}

    "Tissue Type with id and name of the tissues as well as the dataset information"
    ${tissueTypeWithDatasetType}

    """Tissue Annotation type with id, name, annotations object 
     including the name of source and datasets it's present in"""
    ${tissueDetailType}

    "Gene Compound table Types"
    ${geneCompoundType}
    ${geneCompoundTissueType}
    ${geneCompoundDatasetType}
    ${geneCompoundTissueDatasetType}

    "Profile Type"
    ${profileType}
    
    "Mol Type"
    ${molecularProfilingType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
