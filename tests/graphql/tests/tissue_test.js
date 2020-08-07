/* eslint-disable no-undef */
/**
 * Unit test code for testing GraphQL Tissue API endpoints.
 */
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const tissueQueries = require('../queries/tissue_queries');

/**
 * A function that contains tests for test.js.
 * This function is exported, and called in graphql.test.js.
 */
const test = (server) => {

    // test for all tissues route
    it('Returns list of all tissues with "id" and "name" properties', done => {
        request(server)
            .post('/graphql')
            .send({ query: tissueQueries.multipleTissuesTestQuery })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                const { tissues } = res.body.data;
                expect(tissues).to.be.an('array').that.have.lengthOf.above(0);
                tissues.every(tissue => {
                    expect(tissue).to.have.all.keys('id', 'name');
                    expect(tissue.id).to.be.a('number');
                    expect(tissue.name).to.be.string;
                });
                return done();
            });
    });

};

module.exports = {
    test
};
