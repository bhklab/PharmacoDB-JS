// NOTE: Please use the alphabetical order.
const { buildSchema } = require('graphql');
const { cellLineType, cellLineDetailType } = require('./cell');
const { compoundType, compoundAnnotationType, compoundDetailType } = require('./compound');
const { countType, enumAllowedType } = require('./count');
const { datasetType, datasetDetailType, datasetStatsType, datasetsTypesType } = require('./dataset');
const { compoundResponseType } = require('./compound_response');
const { experimentType } = require('./experiment');
const { geneType, geneAnnotationType } = require('./gene');
const { genericType } = require('./generic');
const { geneCompoundTissueType, geneCompoundType } = require('./gene_compound');
const { geneCompoundDatasetType, geneCompoundTissueDatasetType } = require('./gene_compound_analytic');
const { RootQuery } = require('./root_query');
const { summaryType } = require('./summary');
const { sourceAnnotationType } = require('./source');
const { statType } = require('./stat');
const { targetType, compoundTargetType, geneTargetType, geneCompoundTargetType } = require('./target');
const { tissueType, tissueDetailType } = require('./tissue');
const { profileType } = require('./profile');
const { molType } = require('./mol');


// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}
    "Compound Annotation Type with compound id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}
    ${compoundDetailType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}
    ${cellLineDetailType}

    "Count Type"
    ${countType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}
    ${datasetDetailType}
    ${datasetStatsType}
    ${datasetsTypesType}

    "compound Response Type with dose and response values"
    ${compoundResponseType}

    ${enumAllowedType}

    "Experiment Type with experiment_id, cell line, tissue, compound and dataset types."
    ${experimentType}

    "Gene Type with id and name of the genes."
    ${geneType}
    "Gene Annotation Type with gene id, ensg, start and end."
    ${geneAnnotationType}

    "Generic Type"
    ${genericType}

    """Source Annotation type with id, name, tissue information 
    and annotations including the name of source and datasets it's present in"""
    ${sourceAnnotationType}

    "Statistics Type"
    ${statType}

    "Summary Type"
    ${summaryType}

    "Target Type"
    ${targetType}
    ${compoundTargetType}
    ${geneTargetType}
    ${geneCompoundTargetType}

    "Tissue Type with id and name of the tissues."
    ${tissueType}

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
    ${molType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
