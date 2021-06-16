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
    // Initialize knex connction pool and a server instance.
    let knex = require('../../db/knex');
    delete require.cache[require.resolve('../../app')];
    let server = require('../../app');

    // Close the server instance and estroy knex connection pool after all the API tests are done.
    after(async function() {
        server.close();
        await knex.destroy();
    });

    // // tests for Compound API Routes
    // describe('Compound API Routes', () => {
    //     require('./tests/compound_test').test(server);
    // });

    // // tests for Cell API Routes
    // describe('Cell API Routes', () => {
    //     require('./tests/cell_test').test(server);
    // });

    // // tests for Dataset API routes
    // describe('Dataset API Routes', () => {
    //     require('./tests/dataset_test').test(server);
    // });

    // // tests for Gene API Routes
    // describe('Gene API Routes', () => {
    //     require('./tests/gene_test').test(server);
    // });

    // // tests for Tissue API Routes
    // describe('Tissue API Routes', () => {
    //     require('./tests/tissue_test').test(server);
    // });

    // // tests for Target API Routes
    // describe('Target API Routes', () => {
    //     require('./tests/target_test').test(server);
    // });
    
    // // tests for Experiment API routes
    // describe('Experiment API Routes', () => {
    //     require('./tests/experiment_test').test(server);
    // });

    // // tests for Source API routes
    // describe('Source API Routes', () => {
    //     require('./tests/source_test').test(server);
    // });

    // // tests for GeneDrug API routes
    // describe('GeneDrug API Routes', () => {
    //     require('./tests/gene_drug_test').test(server);
    // });
});
