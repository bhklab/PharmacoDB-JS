const { buildSchema } = require('graphql');
const { compoundType, compoundAnnotationType } = require('./compound');
const { cellLineType } = require('./cell');
const { datasetType } = require('./dataset');
const { tissueType } = require('./tissue');
const { geneType } = require('./gene');
const { RootQuery } = require('./root_query');

// schema definition.
const schema = `
    "Compound Type with id, name and annotations."
    ${compoundType}

    "Compound Annotation Type with drug id, smiles, inchikey and pubchem."
    ${compoundAnnotationType}

    "Cell Line Type with id and name of the cell lines."
    ${cellLineType}

    "Dataset Type with id and name of the datasets."
    ${datasetType}

    "Tissue Type with id and name of the tissues."
    ${tissueType}

    "Gene Type with id and name of the genes."
    ${geneType}

    "Root Query"
    ${RootQuery}

    schema {
        query: RootQuery
    }
`;

module.exports = buildSchema(schema);
