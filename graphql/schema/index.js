const { buildSchema } = require('graphql');
const {
    compoundType,
    compoundAnnotationType,
    singleCompoundType
} = require('./compound');
const { cellLineType, cellAnnotationType } = require('./cell');
const { datasetType, datasetInformationType } = require('./dataset');
const { tissueType, tissueAnnotationType, countType } = require('./tissue');
const { geneType, geneAnnotationType } = require('./gene');
const { sourceAnnotationType } = require('./source_annotation');
const { experimentType } = require('./experiment');
const { drugResponseType } = require('./drug_response');
const { RootQuery } = require('./root_query');

// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}

    "Compound Annotation Type with drug id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}
    ${singleCompoundType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}

    "Cell Line Annotation type with id, name, tissue information and annotations including the name of source and datasets it's present in"
    ${sourceAnnotationType}
    ${cellAnnotationType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}
    ${datasetInformationType}

    "Tissue Type with id and name of the tissues."
    ${tissueType}

    "Tissue Annotation type with id, name, annotations object including the name of source and datasets it's present in"
    ${tissueAnnotationType}
    ${countType}

    "Gene Type with id and name of the genes."
    ${geneType}

    "Gene Annotation Type with gene id, ensg, start and end."
    ${geneAnnotationType}

    "Experiment Type with experiment_id, cell line, tissue, compound and dataset types."
    ${experimentType}

    "Drug Response Type with dose and response values"
    ${drugResponseType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
