/**
 * Cell Queries to be used for graphql.test.js
 */

const cellsKeysTestQuery = `
    { 
        cell_lines { 
            id 
            name 
        } 
    }
`;

// this query does not seem to work...
const cellKeysTestQuery = `
    { 
        cell_line(cellId: 178) {
            cell_line {
                id 
                name 
                tissue {
                    id
                    name
                }
                synonyms {
                    name
                    source
                }
            } 
        } 
    }
`;

module.exports = {
    cellsKeysTestQuery,
    cellKeysTestQuery
};
