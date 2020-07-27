/**
 * Unit test code for testing GraphQL Compount API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

/**
 * This describe block encompasses tests for the Compound API.
 * Individual test cases for each function within the compound is organized under a nested describe block.
 */
describe('Tests: Compound API', () => {
    // declare variables used in this test block.
    before(function(){
        this.failures = [];
        this.successes = [];
        
    });

    // Terminate the server after all the tests are done.
    after(function(done) {
        if (this.failures.length) {
            console.log('\tGraphQL: The following ' + this.failures.length + ' test(s) failed:');
            this.failures.forEach(f => console.log('\t\t' + f));
            done();
        } else {
            console.log('\tGraphQL: Passed all ' + this.successes.length + ' test(s).');
            done();
        }
    });

    /**
     * A describe block that contains tests for "comounds" function of the compound module.
     * Title of a function test block should correspond to the name of a function that is being tested. (In this case, "Compounds")
     * Each describe block should have an "afterEach" hook which resets database connection and server instance, and logs a test result to 
     * "successes" or "failures" array.
     */
    describe('compounds function', () => {
        let server = null;
        let knex = null;
        // load a brandnew server and db instances before each test.
        beforeEach(function(){
            delete require.cache[require.resolve('../../app')];
            knex = require('../../db/knex');
            server = require('../../app');
        });

        // Log test result after each test.
        afterEach(function(done) {
            if (this.currentTest.state === 'passed') {
                this.successes.push(this.currentTest.title);
            } else if (this.currentTest.state === 'failed') {
                this.failures.push(this.currentTest.title);
            }
            // close the server and db instances after each test.
            knex.destroy();
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
                        expect(compound).to.have.all.keys('id', 'name'));
                    return done();
                });
        });
    });
});


