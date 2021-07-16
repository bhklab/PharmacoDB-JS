// NOTE: Please use the alphabetical order.
const { buildSchema } = require('graphql');
const { cellLineType, cellLineDetailType, cellLineTestedType } = require('./cell');
const { compoundType, compoundAnnotationType, compoundDetailType } = require('./compound');
const { countType, enumAllowedType } = require('./count');
const { datasetType, datasetDetailType } = require('./dataset');
const { compoundResponseType } = require('./compound_response');
const { experimentType } = require('./experiment');
const { geneType, geneAnnotationType } = require('./gene');
const { genericType } = require('./generic');
const { geneCompoundType } = require('./gene_compound');
const { RootQuery } = require('./root_query');
const { summaryType } = require('./summary');
const { sourceAnnotationType } = require('./source');
const { targetType, compoundTargetType } = require('./target');
const { tissueType, tissueDetailType } = require('./tissue');
const { profileType } = require('./profile');


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
    ${cellLineTestedType}

    "Count Type"
    ${countType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}
    ${datasetDetailType}

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

    "Summary Type"
    ${summaryType}

    "Target Type"
    ${targetType}
    ${compoundTargetType}

    "Tissue Type with id and name of the tissues."
    ${tissueType}

    """Tissue Annotation type with id, name, annotations object 
     including the name of source and datasets it's present in"""
    ${tissueDetailType}

    "Compoundcompound Type"
    ${geneCompoundType}

    "Profile Type"
    ${profileType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
