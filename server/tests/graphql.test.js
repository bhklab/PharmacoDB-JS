/**
 * Unit test code for testing GraphQL API endpoints.
 * Place all GraphQL API tests in this file as follows.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

/**
 * This describe block encompasses all GraphQL API tests.
 * Individual test cases for each resolver is organized under a nexted describe block.
 * For example, tests for compound.js resolver goes under the "Compound" describe block.
 */
describe('Tests: GraphQL API', () => {
    let knex = null;
    // declare variables used in this test block.
    before(function(){
        this.failures = [];
        this.successes = [];
        knex = require('../db/knex');
    })

    // Terminate the server after all the tests are done.
    after(function() {
        if (this.failures.length) {
            console.log('\tGraphQL: The following ' + this.failures.length + ' test(s) failed:');
            this.failures.forEach(f => console.log('\t\t' + f));
            // Exit the process with an error code.
            process.exit(1);
        } else {
            console.log('\tGraphQL: Passed all ' + this.successes.length + ' test(s).');
        }
        knex.destroy();
    });

    /**
     * A describe block that contains tests for the compound API.
     * Title of an API test block should correspond to the resolver file name of the code 
     * that is being tested. (In this case, "Compound")
     * Each describe block should have an "afterEach" hook which logs a test result to 
     * "successes" or "failures" array.
     */
    describe('Compound', () => {
        let server = null;
        
        // load a brandnew server instance before each test.
        beforeEach(function(){
            delete require.cache[require.resolve('../app')];
            server = require('../app');
        })

        // Log test result after each test.
        afterEach(function(done) {
            if (this.currentTest.state === 'passed') {
                this.successes.push(this.currentTest.title);
            } else if (this.currentTest.state === 'failed') {
                this.failures.push(this.currentTest.title);
            }
            // close the server instance after each test.
            server.close(done);
        });
    
        /**
         * An example test case for the Compound API.
         * Each test case should have a title that describes an expected outcome.
         */
        it('Returns "id" and "name" properties of all compounds in the database', done => {
            request(server)
                .post('/graphql')
                .send({ query: '{ compounds { id name } }' })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.data.compounds.every(compound =>
                        expect(compound).to.have.all.keys('id', 'name')
                    );
                    return done();
                });
        });
    });
})


