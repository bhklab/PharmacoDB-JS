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
`

const cellKeysTestQuery = `
    { 
        cell_line(cellId: 481) {
            cell_line {
                id 
                name 
                tissue {
                    id
                    name
                }
            } 
        } 
    }
`

module.exports = {
    cellsKeysTestQuery,
    cellKeysTestQuery
}