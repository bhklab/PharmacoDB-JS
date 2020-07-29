/**
 * Unit test code for testing GraphQL Compound API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const comoundQueries = require('./queries/compound_queries');
const cellQueries = require('./queries/cells_queries');

/**
 * This describe block encompasses tests for the GrahQL API.
 * Individual test cases for each API is organized under a nested describe block.
 */
describe('Tests: GraphQL API', () => {
    let server = null;
    let knex = null;
    // declare variables used in this test block.
    before(function(){
        this.failures = [];
        this.successes = [];
        delete require.cache[require.resolve('../../app')];
        knex = require('../../db/knex');
        server = require('../../app');
    });

    // Terminate the server after all the tests are done.
    after(function(done) {
        if (this.failures.length) {
            console.log('\tGraphQL: The following ' + this.failures.length + ' test(s) failed:');
            this.failures.forEach(f => console.log('\t\t' + f));
            //done();
        } else {
            console.log('\tGraphQL: Passed all ' + this.successes.length + ' test(s).');
            //done();
        }
        knex.destroy();
        server.close(done);
    });

    /**
     * A describe block that contains tests for "comounds" function of the compound module.
     * Title of a function test block should correspond to the name of a function that is being tested. (In this case, "Compounds")
     * Each describe block should have an "afterEach" hook which resets database connection and server instance, and logs a test result to 
     * "successes" or "failures" array.
     */
    describe('compound.js', () => {
        // Log test result after each test.
        afterEach(function(done) {
            if (this.currentTest.state === 'passed') {
                this.successes.push(this.currentTest.title);
            } else if (this.currentTest.state === 'failed') {
                this.failures.push(this.currentTest.title);
            }
            // close the server and db instances after each test.
            // knex.destroy();
            // server.close(done);
            done();
        });
    
        it('Returns "id" and "name" properties of all compounds in the database', done => {
            request(server)
                .post('/graphql')
                .send({ query: comoundQueries.compoundsKeysTestQuery })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.data.compounds.every(compound =>
                        expect(compound).to.have.all.keys('id', 'name')
                    );
                    return done();
                });
        });

        it('Returns a compound object based on a compound ID input.', done => {
            request(server)
                .post('/graphql')
                .send({ query: comoundQueries.compoundKeysTestQuery })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    const compound = res.body.data.compound.compound;
                    expect(compound).to.have.keys('id', 'name', 'annotation');
                    expect(compound.annotation).to.have.keys('smiles', 'inchikey', 'pubchem');
                    return done();
                });
        });

        it('Returns a compound object for paclitaxel.', done => {
            request(server)
                .post('/graphql')
                .send({ query: comoundQueries.compoundQueryPaclitaxel })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    const compound = res.body.data.compound.compound;
                    expect(compound.id).to.equal(526);
                    expect(compound.name).to.equal('paclitaxel');
                    return done();
                });
        });

    });

    describe('cell.js', () => {

        // Log test result after each test.
        afterEach(function(done) {
            if (this.currentTest.state === 'passed') {
                this.successes.push(this.currentTest.title);
            } else if (this.currentTest.state === 'failed') {
                this.failures.push(this.currentTest.title);
            }
            done();
        });
    
        it('Returns "id" and "name" properties of all cell lines in the database', done => {
            request(server)
                .post('/graphql')
                .send({ query: cellQueries.cellsKeysTestQuery })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    res.body.data.cell_lines.every(cell =>
                        expect(cell).to.have.all.keys('id', 'name')
                    );
                    return done();
                });
        });

        // it('Returns a cell_line object based on the id input', done => {
        //     request(server)
        //         .post('/graphql')
        //         .send({ query: cellQueries.cellKeysTestQuery })
        //         .expect(200)
        //         .end((err, res) => {
        //             if (err) return done(err);
        //             const cell_line = res.body.data.cell_line.cell_line;
        //             expect(cell_line).to.have.keys('id', 'name', 'tissue');
        //             expect(cell_line.tissue).to.have.keys('id', 'name');
        //             return done();
        //         });
        // });

    });

});