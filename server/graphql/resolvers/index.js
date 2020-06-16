const compoundResolver = require('./compound');
const cellLineResolver = require('./cell');

const rootResolver = {
    ...compoundResolver,
    ...cellLineResolver
};

module.exports = rootResolver;
