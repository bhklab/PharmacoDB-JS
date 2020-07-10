// NOTE: Please use the alphabetical order.
const { buildSchema } = require('graphql');
const { compoundType, compoundAnnotationType, singleCompoundType } = require('./compound');
const { cellLineType, cellAnnotationType } = require('./cell');
const { datasetType, datasetInformationType } = require('./dataset');
const { drugResponseType } = require('./drug_response');
const { experimentType } = require('./experiment');
const { geneType, geneAnnotationType } = require('./gene');
const { RootQuery } = require('./root_query');
const { sourceType } = require('./source');
const { sourceAnnotationType } = require('./source_annotation');
const { targetType, compoundTargetType } = require('./target');
const { tissueType, tissueAnnotationType, countType } = require('./tissue');


// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}
    "Compound Annotation Type with drug id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}
    ${singleCompoundType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}
    """Cell Line Annotation type with id, name, tissue information 
     and annotations including the name of source and datasets it's present in"""
    ${sourceAnnotationType}
    ${cellAnnotationType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}
    ${datasetInformationType}

    "Drug Response Type with dose and response values"
    ${drugResponseType}

    "Experiment Type with experiment_id, cell line, tissue, compound and dataset types."
    ${experimentType}

    "Gene Type with id and name of the genes."
    ${geneType}
    "Gene Annotation Type with gene id, ensg, start and end."
    ${geneAnnotationType}

    "Source Type"
    ${sourceType}

    "Target Type"
    ${targetType}
    ${compoundTargetType}

    "Tissue Type with id and name of the tissues."
    ${tissueType}
    """Tissue Annotation type with id, name, annotations object 
     including the name of source and datasets it's present in"""
    ${tissueAnnotationType}
    ${countType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
