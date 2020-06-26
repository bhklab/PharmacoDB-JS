const compoundResolver = require('./compound');
const cellLineResolver = require('./cell');
const datasetResolver = require('./dataset');
const geneResolver = require('./gene');
const tissueResolver = require('./tissue');

const rootResolver = {
    ...compoundResolver,
    ...cellLineResolver,
    ...datasetResolver,
    ...geneResolver,
    ...tissueResolver
};

module.exports = rootResolver;
