/**
 * Cell Queries to be used for graphql.test.js
 */

const multipleCellsTestQuery = `
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

const singleCellTestQuery = `
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
                source {
                    id,
                    name
                }
            }
        }
    }
`;

module.exports = {
    multipleCellsTestQuery,
    singleCellTestQuery
};
