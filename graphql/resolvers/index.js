const compoundResolver = require('./compound');
const cellLineResolver = require('./cell');
const datasetResolver = require('./dataset');
const experimentResolver = require('./experiment');
const geneResolver = require('./gene');
const targetResolver = require('./target');
const tissueResolver = require('./tissue');

const rootResolver = {
    ...compoundResolver,
    ...cellLineResolver,
    ...datasetResolver,
    ...experimentResolver,
    ...geneResolver,
    ...targetResolver,
    ...tissueResolver
};

module.exports = rootResolver;