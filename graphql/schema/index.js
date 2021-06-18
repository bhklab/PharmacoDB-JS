// NOTE: Please use the alphabetical order.
const { buildSchema } = require('graphql');
const { cellLineType, cellAnnotationType, cellLineDetailType } = require('./cell');
const { compoundType, compoundAnnotationType, compoundDetailType } = require('./compound');
const { countType, summaryType, genericType, enumAllowedType } = require('./count');
const { datasetType, datasetDetailType } = require('./dataset');
const { drugResponseType } = require('./drug_response');
const { experimentType } = require('./experiment');
const { geneType, geneAnnotationType } = require('./gene');
const { geneDrugType } = require('./gene_drug');
const { RootQuery } = require('./root_query');
const { targetType, compoundTargetType } = require('./target');
const { tissueType, tissueDetailType } = require('./tissue');
const { profileType } = require('./profile');


// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}
    "Compound Annotation Type with drug id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}
    ${compoundDetailType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}
    """Cell Line Annotation type with id, name, tissue information 
     and annotations including the name of source and datasets it's present in"""
    ${cellAnnotationType}
    ${cellLineDetailType}

    "Count Type"
    ${countType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}
    ${datasetDetailType}

    "Drug Response Type with dose and response values"
    ${drugResponseType}

    ${enumAllowedType}

    "Experiment Type with experiment_id, cell line, tissue, compound and dataset types."
    ${experimentType}

    "Gene Type with id and name of the genes."
    ${geneType}
    "Gene Annotation Type with gene id, ensg, start and end."
    ${geneAnnotationType}

    "Generic Type"
    ${genericType}

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

    "GeneDrug Type"
    ${geneDrugType}

    "Profile Type"
    ${profileType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
