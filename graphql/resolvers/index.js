const compoundResolver = require('./compound');
const cellLineResolver = require('./cell');
const datasetResolver = require('./dataset');
const dataTypeStatResolver = require('./stat');
const experimentResolver = require('./experiment');
const geneResolver = require('./gene');
const targetResolver = require('./target');
const tissueResolver = require('./tissue');
const geneCompoundResolver = require('./gene_compound');
const geneCompoundAnalyticResolver = require('./gene_compound_analytic');
const molecularProfilingResolver = require('./molecular_profiling');
const searchResolver = require('./search');

const rootResolver = {
    ...compoundResolver,
    ...cellLineResolver,
    ...datasetResolver,
    ...dataTypeStatResolver,
    ...experimentResolver,
    ...geneResolver,
    ...targetResolver,
    ...tissueResolver,
    ...geneCompoundResolver,
    ...geneCompoundAnalyticResolver,
    ...molecularProfilingResolver,
    ...searchResolver,
};

module.exports = rootResolver;
