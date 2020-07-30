/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Compound API endpoints.
 */

/**
 * This describe block encompasses tests for the GrahQL API.
 * 
 * Individual test cases for each API is organized in a separate file under the test() function, 
 * and is called in a nested describe block.
 * 
 * Each test is executed with brandnew server instance, but uses the same knex connection pool, 
 * since destroying knex connection pool is an irreversible operation.
 * 
 * This allows the test cases for each API to be organized in separate fles, 
 * but called under one describe block using shared knex connection pool.
 */
describe('Tests: GraphQL API', () => {
    let knex = null;

    // Initialize knex connction pool ebfore the tests.
    before(function(){
        knex = require('../../db/knex');
    });

    // Destroy knex connection pool after all the API tests are done.
    after(async function() {
        await knex.destroy();
    });

    // tests for compound.js
    describe('compound.js', () => {
        require('./tests/compound_test').test();
    });

    // tests for cell.js
    describe('cell.js', () => {
        require('./tests/cell_test').test();
    });

});
