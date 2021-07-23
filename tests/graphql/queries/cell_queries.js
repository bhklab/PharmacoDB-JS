/**
 * Cell Queries to be used for graphql.test.js
 */

const cellsKeysTestQuery = `
    { 
        cell_lines { 
            id 
            name
            tissue {
                id
                name
            }
        } 
    }
`;

const cellKeysTestQuery = `
    {
        cell_line(cellId: 1) {
            id,
            name
            tissue {
                id,
                name
            }
            synonyms {
                name
                source
            }
        }
    }
`;

module.exports = {
    cellsKeysTestQuery,
    cellKeysTestQuery
};
